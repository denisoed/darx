import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class PostService {

  domain = 'http://localhost:3000/';
  options;

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  createPost(post) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'post/add-post', post, this.options).map(res => res.json());
  }

  getAllPosts() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'post/all-posts', this.options).map(res => res.json());
  }

}
