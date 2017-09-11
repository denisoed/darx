import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


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
        'Accept': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  // Search post
  search(terms: Observable<string>) {
    return terms.debounceTime(300)
      .distinctUntilChanged()
      .switchMap( term => this.searchPost(term) );
  }

  searchPost(term) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'post/search-posts?title=' + term, this.options).map(res => res.json());
  }

  // Create new post
  createPost(post) {
    this.createAuthenticationHeaders(); 

    let formData: FormData = new FormData();
    formData.append('post', JSON.stringify(post));
    formData.append('imagePost', post.image);

    return this.http.post(this.domain + 'post/add-post', formData, this.options).map(res => res.json());
  }

  getAllPosts() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'post/all-posts', this.options).map(res => res.json());
  }

  getSinglePost(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'post/single-post/' + id, this.options).map(res => res.json());
  }

  getUserPosts(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'post/user-posts/' + id, this.options).map(res => res.json());
  }
  
  editPost(post) {
    this.createAuthenticationHeaders();
    let formData: FormData = new FormData();

    formData.append('post', JSON.stringify(post));
    formData.append('image', post.image);
    return this.http.put(this.domain + 'post/update-post/', formData, this.options).map(res => res.json());
  }

  deletePost(id) {
    this.createAuthenticationHeaders();

    return this.http.delete(this.domain + 'post/delete-post/' + id, this.options).map( res => res.json());
  }

  likePost(id) {
    this.createAuthenticationHeaders();
    const postData = { id: id };
    return this.http.put(this.domain + 'post/likePost/', postData, this.options).map(res => res.json());
  }

  dislikePost(id) {
    this.createAuthenticationHeaders();
    const postData = { id: id };
    return this.http.put(this.domain + 'post/dislikePost/', postData, this.options).map(res => res.json());
  }

  postNewComment(id, comment) {
    this.createAuthenticationHeaders();
    const postData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'post/add-comment/', postData, this.options).map(res => res.json());
  }

  replyComment(postId, commentIndex, replyComment) {
    this.createAuthenticationHeaders();
    const postData = {
      postId: postId,
      commentIndex: commentIndex,
      replyComment: replyComment
    }

    return this.http.post(this.domain + 'post/reply-comment/', postData, this.options).map(res => res.json());
  }

}
