import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  currentUrl;
  post;
  messageClass;
  message;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.postService.getSinglePost(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'single-post-warning';
        this.message = data.message;
      } else {
        this.post = data.post;
      } 
    });
  }

}
