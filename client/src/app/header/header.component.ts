import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
  // animations: [
  //   trigger('accountMenu', [

  //   ])
  // ]
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate['/'];
  }

  ngOnInit() {
  }

}
