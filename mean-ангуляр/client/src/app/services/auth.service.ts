import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt'; // fresh: @auth0/angular-jwt

@Injectable()
export class AuthService {
  // class properties, so we can access it from anywhere in class
  authToken: any;
  user: any;

  constructor(private http: Http) { console.log("Auth Service Initialized..."); }

/**
*   ==== Authorization: ====
*/

  //private headers = new Headers({'Content-Type': 'application/json'});

  registerUser(user) { // takes from Backend API (Expressjs)
    //console.log("Client registering user...");
    //console.log("user is: ", user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // End-point: 'http://localhost:3000/users/register'
    // Heroku: 'users/register'
    // body: JSON.stringify({ user: user }) // nope, no need. did it in storeUserData fn
    // костыль: .map(res => { return res.json();});
    return this.http.post('users/register', user, { headers: /*this.*/headers })
                    .map(res => res.json());
  }

  authenticateUser(user) {
    console.log("Client authenticating user...");
    //console.log("user is: ", user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // End-point: 'http://localhost:3000/users/auth'
    // Heroku: 'users/auth'
    return this.http.post('users/auth', user, { headers: /*this.*/headers })
                    .map(res => res.json());
    // It returns success/err and user info -- we need store it somewhere (defined in login component)
  }

  // cache/cookie configuration analogy
  storeUserData(token, user) {
    // store parameters in local storage
    //localStorage.setItem('token', token); // first param is default localStorage 'legacy'
    localStorage.setItem('id_token', token); // OR NOT?!
    localStorage.setItem('user', JSON.stringify(user)); // localStorage can store only strings
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

/**
*   ==== user data access control: ====
*/

  getProfile() {
    //console.log("user is: ", user);
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    // End-point: 'http://localhost:3000/users/profile'
    // Heroku: 'users/profile'
    return this.http.get('users/profile', { headers: /*this.*/headers })
                    .map(res => res.json());
  }

  loadToken() {
    // fetch token from localStorage (and give it to getProfile)
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  // auth guard. checking if we're loggedIn. if token there, makes sure it's not expired
  loggedIn() {
    return tokenNotExpired('id_token');
  }

}
