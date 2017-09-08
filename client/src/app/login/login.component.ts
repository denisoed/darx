import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';  
import { AuthService } from './../services/auth.service';
import { AuthGuard } from "../guards/auth.guard";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass; 
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm();
   }

  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        this.validateEmail
      ])],
      password: ['', Validators.required]
    });
  }

  closeMessage(time) {
    setTimeout(() => {
      this.message = null;
      this.messageClass = null;
    }, time);
  }

  onLoginSubmit(){
    const user = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }

    this.authService.login(user).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'login-warning bounceInRight';
        this.message = data.message;
        this.closeMessage(3000);
      }else {
        this.messageClass = 'login-success bounceInRight';
        this.message = data.message;
        this.closeMessage(3000);
        this.authService.storeUserData(data.token, data.user);
        setTimeout(() => {
          if(this.previousUrl) {
            this.router.navigate([this.previousUrl]);
          }else{
            this.router.navigate(['/profile']);
          }
        }, 1000);
      }
    })
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true }
    }
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl){
      this.messageClass = 'login-warning';
      this.message = 'You must bo logged in to view that page.'
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;
    }
  }

}
