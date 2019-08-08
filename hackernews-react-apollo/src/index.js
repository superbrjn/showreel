import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

import { BrowserRouter } from 'react-router-dom'

// Apollo makes HTTP-requests for me
import { ApolloProvider } from 'react-apollo' // above getting any GraphQL data
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { AUTH_TOKEN } from './constants'
import { ApolloLink } from 'apollo-client-preset'

// websocket-subscription
import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// create HttpLink that connects ApolloClient instance with the GraphQL API (server).
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

// auth-signing of every request ApolloClient to API
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

// ws-subscription
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    }
  }
})
/*
split is used to “route” a request to a specific middleware link. It takes
three arguments, the first one is a test function which returns a boolean.
The remaining two arguments are again of type ApolloLink. If test returns true,
the request will be forwarded to the link passed as the second argument. If false,
to the third one.
In your case, the test function is checking whether the requested operation is a subscription.
If this is the case, it will be forwarded to the wsLink, otherwise (if it’s a query or mutation),
the httpLinkWithAuthToken will take care of it
*/
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkWithAuthToken,
)

// init ApolloClient
const client = new ApolloClient({
  //link: httpLink,
  //link: httpLinkWithAuthToken,
  link,
  cache: new InMemoryCache()
})

// ============================================================================
// render the root component of your React app.
// The App is wrapped with the higher-order component ApolloProvider that gets
// passed the client as a prop.
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)
registerServiceWorker()
