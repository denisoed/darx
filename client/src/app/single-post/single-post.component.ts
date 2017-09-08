import { Component, OnInit } from '@angular/core';
import { PostService } from "../services/post.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  form: FormGroup;
  formReply: FormGroup;
  currentUrl;
  post;
  messageClass;
  message;
  user;
  ReplyComment: boolean = false;
  indexReply;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.createForm();
    this.createFormReply();
   }

  createForm() {
    this.form = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    });
  }

  createFormReply() {
    this.formReply = this.formBuilder.group({
      replyComment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    });
  }

  toggleTextareaReplyComment(index) {
    let comments = document.getElementsByClassName('the-comment');
    let indexForm = comments[index].getElementsByTagName('FORM');
    indexForm[0].classList.remove('closeReply');
  }

  closeMessage(time) {
    setTimeout(() => {
      this.message = null;
      this.messageClass = null;
    }, time);
  }

  likePost(id) {
    this.postService.likePost(id).subscribe(data => {
      if (!data.success) {
        this.message = data.message;
        this.messageClass = 'single-post-warning bounceInRight';
        this.closeMessage(3000);
      } else {
        this.message = data.message;
        this.messageClass = 'single-post-success bounceInRight';
        this.closeMessage(3000);
        this.postService.getSinglePost(this.currentUrl.id).subscribe(data => {
          if (!data.success) {
            this.messageClass = 'single-post-warning bounceInRight';
            this.message = data.message;
            this.closeMessage(3000);
          } else {
            this.post = data.post;
          }
        });
      }
    });
  }

  dislikePost(id) {
    this.postService.dislikePost(id).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'single-post-warning bounceInRight';
        this.closeMessage(3000);
      } else {
        this.message = data.message;
        this.messageClass = 'single-post-success bounceInRight';
        this.closeMessage(3000);
        this.postService.getSinglePost(this.currentUrl.id).subscribe(data => {
          if (!data.success) {
            this.message = data.message;
            this.messageClass = 'single-post-warning bounceInRight';
            this.closeMessage(3000);
          } else {
            this.post = data.post;
          }
        });
      }
    });
  }
  
  postNewComment(id) {
    const newComment = {
      comment: this.form.get('comment').value,
      commentCreatedAt: Date.now()
    }
    
    this.postService.postNewComment(id, newComment).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'single-post-warning bounceInRight';
        this.closeMessage(3000);
      } else {
        this.message = data.message;
        this.messageClass = 'single-post-success bounceInRight';
        this.closeMessage(3000);
        this.getSinglePost();
      }
    });
  }

  replyComment(postId, commentIndex) {
    console.log(commentIndex);
    const replyComment = {
      comment: this.formReply.get('replyComment').value,
      commentCreatedAt: Date.now()
    }

    this.postService.replyComment(postId, commentIndex, replyComment).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'single-post-warning bounceInRight';
        this.closeMessage(3000);
      } else {
        this.message = data.message;
        this.messageClass = 'single-post-success bounceInRight';
        this.closeMessage(3000);
        this.getSinglePost();
      }
    });
  }

  getProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    });
  }

  getSinglePost() {
    this.postService.getSinglePost(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.message = data.message;
        this.messageClass = 'single-post-warning bounceInRight';
        this.closeMessage(3000);
      } else {
        this.post = data.post;
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.getSinglePost();
    this.getProfile();
  }

}
