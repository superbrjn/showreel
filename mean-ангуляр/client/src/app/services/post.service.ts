import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostService {

  constructor(private http: Http) {
    console.log('Post Service Initialized...');
  }

  getPosts() {
    return this.http.get('/api/posts')
                    .map(res => res.json());
  }

  addPost(newPost)/*: Observable<any>*/ {
    console.log(newPost);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // End-point: 'http://localhost:3000/api/post'
    return this.http.post('/api/post', JSON.stringify(newPost), {headers: headers})
                    .map(res => res.json());
  }

  deletePost(id) {
    return this.http.delete('/api/post/' + id)
                    .map(res => res.json());
  }

  updateStatus(post) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('/api/post/' + post._id, JSON.stringify(post), {headers: headers})
                    .map(res => res.json());
  }

}
