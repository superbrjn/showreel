import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[];
  title: string;
  created: any = Date.now();//Object
  user: Object;
  author: this.userService.getCurrentUser()

  constructor(
    private postService: PostService,
    private authService: AuthService,
  ) {
    this.postService.getPosts()
        .subscribe(posts => {
          //console.log(posts); // console doesn't see it
          this.posts = posts;
        });
  }

  ngOnInit() {
    // on loading page we get data immidiatly
    this.authService.loadToken()
                    .subscribe(token => {
                      this.user = token.user;
                    },
                  err => {
                    console.log(err);
                    return false;
                  });
  }

  addPost(event) {
    event.preventDefault();
    //console.log(this.title);
    const newPost = { // private newPost: Post = new Post();
      title: this.title,
      //isDone: false
      author: this.profile.user,// this newPost.user = this.profile.user;
      created: this.created,
    }

    this.postService.addPost(newPost)
                    .subscribe(post => {
                      this.posts.push(post); // put post in db
                      this.title = ''; // clear
                    });
  }

  deletePost(id) {
    const posts = this.posts;
    this.postService.deletePost(id)
                    .subscribe(data => { // time for ugly old-fashioned loops instead of functional filter
                      if (data.n === 1) {
                        for (let i = 0; i < posts.length; i++) {
                          if (posts[i]._id === id) {
                            posts.splice(i, 1)
                          }
                        }
                      }
                    });
  }

  updateStatus(post) {
    const _post = {
      _id: post._id,
      title: post.title,
      isDone: !post.isDone
    }

    this.postService.updateStatus(_post)
                    .subscribe(data => {
                      post.isDone = !post.isDone;
                    });
  }

}
