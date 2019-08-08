import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { LINKS_PER_PAGE } from '../constants'

class LinkList extends Component {
  /*_updateCacheAfterVote = (store, createVote, linkId) => {
    // reading
    const data = store.readQuery({ query: FEED_QUERY })
    // retrieving
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    // take the modified data and write it back into the store
    store.writeQuery({ query: FEED_QUERY, data })
  }*/

  componentDidMount() {
    this._subscribeToNewLinks()
    this._subscribeToNewVotes()
  }

  render() {
    // Is true as long as the request is still ongoing and the response hasn’t been received.
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>
    }

    // In case the request fails, this field will contain information about what exactly went wrong.
    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }

    // This is the actual data that was received from the server. It has the links property which represents a list of Link elements.
    //const linksToRender = this.props.feedQuery.feed.links
    const isNewPage = this.props.location.pathname.includes('new')
    const linksToRender = this._getLinksToRender(isNewPage)
    const page = parseInt(this.props.match.params.page, 10)

    return (
      <div>
        <div>
          {linksToRender.map((link, index) => (
              <Link key={link.id} index={page ? (page - 1) * LINKS_PER_PAGE + index : index} updateStoreAfterVote={this._updateCacheAfterVote} link={link}/>
          ))}
        </div>
        {isNewPage &&
        <div className='flex ml4 mv3 gray'>
          <div className='pointer mr2' onClick={() => this._previousPage()}>Previous</div>
          <div className='pointer' onClick={() => this._nextPage()}>Next</div>
        </div>
        }
      </div>
    )
  }

  _getLinksToRender = (isNewPage) => {
    if (isNewPage) {
      return this.props.feedQuery.feed.links
    }
    const rankedLinks = this.props.feedQuery.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({ query: FEED_QUERY, variables: { first, skip, orderBy } })

    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = () => {
  this.props.feedQuery.subscribeToMore({
    document: gql`
      subscription {
        newLink {
          node {
            id
            url
            description
            createdAt
            postedBy {
              id
              name
            }
            votes {
              id
              user {
                id
              }
            }
          }
        }
      }
    `,
    updateQuery: (previous, { subscriptionData }) => {
      const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links]
      const result = {
        ...previous,
        feed: {
          links: newAllLinks
        },
      }
      return result
    },
  })
  }

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              link {
                id
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        console.log(`NEW VOTE`)
        const votedLinkIndex = previous.feed.links.findIndex(
          link => link.id === subscriptionData.data.newVote.node.link.id,
        )
        const newAllLinks = previous.feed.links.slice()
        const result = {
          ...previous,
          allLinks: newAllLinks,
        }
        return result
      },
    })
  }
}

// here we create a query opearation
/*
The query now accepts arguments that we’ll use to implement pagination
and ordering. skip defines the offset where the query will start. If you
passed a value of e.g. 10 for this argument, it means that the first 10 items
of the list will not be included in the response. first then defines the limit,
or how many elements, you want to load from that list. Say, you’re passing the
10 for skip and 5 for first, you’ll receive items 10 to 15 from the list.
*/
export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`
// We then can use the graphql container to pass the query results returned by QUERY
// to a component as a prop (and update them as the results change)

// Note that you’re also passing an options object to the function call where
// you specify the name to be feedQuery. This is the name of the prop that
// Apollo injects into the LinkList component. If you didn’t specify it here,
// the injected prop would be called data by default.

/*
You’re now passing a function to graphql that takes in the props of the
component (ownProps) before the query is executed. This allows you to retrieve
the information about the current page from the router (ownProps.match.params.page)
and use it to calculate the chunk of links that you retrieve with first and skip.

Also note that you’re including the ordering attribute createdAt_DESC for the
new page to make sure the newest links are displayed first. The ordering for
the /top route will be calculated manually based on the number of votes for each link.
*/
export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  options: ownProps => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy },
    }
  },
})(LinkList)
