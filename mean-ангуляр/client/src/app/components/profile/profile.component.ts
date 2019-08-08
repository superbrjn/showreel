import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Post } from '../../models/post';
import { DatePipe } from '@angular/common';
// check if ngIf works!

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  posts: Post[];
  title: string;
  created: any = Date.now(); //Object
  author: Object; //this.userService.getCurrentUser()

  constructor(
    private authService: AuthService,
    private router: Router,
    private postService: PostService,
  ) {
    // GET: load all posts on pageload
    this.postService.getPosts()
        .subscribe(posts => {
          //console.log(posts); // console doesn't see it
          this.posts = posts;
        });
  }

  ngOnInit() {
    // load user:
    // on loading page we get data immidiatly
    this.authService.getProfile()
                    .subscribe(profile => {
                      this.user = profile.user;
                    },
                  err => {
                    console.log(err);
                    return false;
                  });
  }

  // POST: create post
  addPost(event) {
    event.preventDefault();
    //console.log(this.title);
    const newPost = { // private newPost: Post = new Post();
      title: this.title,
      //isDone: false
      author: this.profile.user,// this newPost.user = this.profile.user;
      created: this.created,
      aprooved: false,
    }

    this.postService.addPost(newPost)
                    .subscribe(post => {
                      this.posts.push(post); // put post in db
                      this.title = ''; // clear
                    });
  }

  // DEL: del post
  deletePost(id) {
    const posts = this.posts;

    this.postService.deletePost(id)
                    .subscribe(data => {
                      if (this.profile.user === post.author) {
                        if (data.n === 1) { // time for ugly old-fashioned loops instead of functional filter
                          for (let i = 0; i < posts.length; i++) {
                            if (posts[i]._id === id) {
                              posts.splice(i, 1)
                            }
                          }
                        }
                      }
                    });
  }

  // PUT: update/edit post
  updatePost(post) {
    const _post = {
      _id: post._id,
      title: post.title,
      //isDone: !post.isDone
    }

    this.postService.updatePost(_post)
                    .subscribe(data => {
                      if (this.profile.user === post.author) {
                        if (this.post.title !== post.title) {
                          this.posts.push(post);
                        }
                      }
                    });
  }

/** ===================
*  === User control ===
*  =================*/
  editUser(user) {}
  deleteUser(user._id) {}
  follow(user) {}
  unfollow(user._id) {}

  onNicknameClick(user.id) {
    // get post.author.id
    //this.postService.
    /*this.authService.getProfile(user.id)
                    .subscribe(profile => {
                      this.post.author.user.id = profile.user;
                    };

    this.router.navigate(['/profile']);*/
  }

}
