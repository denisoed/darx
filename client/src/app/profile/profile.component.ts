import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { PostService } from "./../services/post.service";
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user;
  userAllPosts;
  allLikes: number = 0;
  allDislikes: number = 0;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}

  getProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.postService.getUserPosts(profile.user._id).subscribe(data => {
        this.userAllPosts = data.posts;

        // Get all likes
        for (var i = 0; i < data.posts.length; i++) {
          this.allLikes += data.posts[i].likes;
        }
        
        // Get all Dislikes
        for (var i = 0; i < data.posts.length; i++) {
          this.allDislikes += data.posts[i].dislikes;
        }
      });

    });
  }

  ngOnInit() {
      this.getProfile();
  }

}
