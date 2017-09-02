import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken;
  user;
  options;
  domain = 'http://localhost:3000/';


  constructor(
    private http: Http
  ) { }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = localStorage.getItem('token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  registerUser(user) { 

    let formData: FormData = new FormData();
    formData.append('user', JSON.stringify(user));
    formData.append('avatar', user.avatar);

    return this.http.post(this.domain + 'authentication/register', formData).map(res => res.json());
  }
  
  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' +  email).map(res => res.json());
  }
  
  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' +  username).map(res => res.json());
  }
  
  login(user) {
    return this.http.post(this.domain + 'authentication/login', user).map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res => res.json());
  }

  loggedIn() {
    return tokenNotExpired();
  }

}
