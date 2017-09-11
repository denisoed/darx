import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { PostService } from '../services/post.service';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(-100%)', opacity: 0 }),
          animate('400ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('400ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
        ])
      ]
    )
  ],
})
export class HeaderComponent implements OnInit {

  results;
  user;
  show: boolean = false;

  private searchTerm = new Subject<string>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private postService: PostService
  ) { 

      this.postService.search(this.searchTerm)
      .subscribe(data => {
        this.results = data.posts;
      });

  }
  
  onKeyup(searchText: string) {
    if (searchText) {
      this.searchTerm.next(searchText);
    } else {
      setTimeout(() => {
        this.results = '';
      }, 300);
    };
  }

  toolgeSearchBox() {
    let searchModal = document.getElementsByClassName('search-modal');
    searchModal[0].classList.toggle('hideModal');
  }

  onLogoutClick() {
    this.authService.logout();
    this.show = false;
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.user = data.user;
    });
  }

}
