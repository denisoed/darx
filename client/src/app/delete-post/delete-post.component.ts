import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css']
})
export class DeletePostComponent implements OnInit {

  currentUrl;
  post;
  messageClass;
  message;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  deletePost() {
    this.postService.deletePost(this.currentUrl.id).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'delete-post-warning';
      } else {
        this.message = data.message;
        this.messageClass = 'delete-post-success';
        setTimeout(()=> {
          this.router.navigate(['/profile']);
        }, 500);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.postService.getSinglePost(this.currentUrl.id).subscribe(data => {
      this.post = data.post;
    });
  }

}
