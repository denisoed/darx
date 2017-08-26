import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken;
  user;
  options;


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
    return this.http.post('http://localhost:8080/authentication/register', user).map(res => res.json());
  }
  
  checkEmail(email) {
    return this.http.get('http://localhost:8080/authentication/checkEmail/' +  email).map(res => res.json());
  }
  
  checkUsername(username) {
    return this.http.get('http://localhost:8080/authentication/checkUsername/' +  username).map(res => res.json());
  }
  
  login(user) {
    return this.http.post('http://localhost:8080/authentication/login', user).map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('email', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get('http://localhost:8080/authentication/profile', this.options).map(res => res.json());
  }

  loggedIn() {
    return tokenNotExpired();
  }

}
