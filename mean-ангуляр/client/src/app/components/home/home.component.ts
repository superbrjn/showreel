import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: Object;
  posts: Post[];

  constructor(
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
  }

// set pagination limit to upload only 25 posts!
// https://g00glen00b.be/pagination-component-angular-2/
// https://stackoverflow.com/questions/45699319/how-can-i-create-a-pagination-component-in-angular-4

}
