import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  EventEmitter

} from '@angular/core';
import { PostService } from "../services/post.service";
import { ActivatedRoute } from "@angular/router";
declare var tinymce: any;

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, AfterViewInit, OnDestroy {

  message;
  messageClass;
  skinUrl: string = '/assets/';
  currentUrl;
  editor;
  elementId = 'post-editor';
  imagePost;
  post = {
    title: '',
    image: this.imagePost,
    text: '',
    category: ''
  };
  category = [
    'Interviews',
    'Video and Audio',
    'Photography',
    'News from around the World',
    'Other Stuff'
  ];

  ngOnDestroy(): void {
    tinymce.remove(this.editor);
  }

  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['paste', 'table', 'image', 'link', 'preview', 'textcolor', 'print', 'media'],
      toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
      toolbar2: "print preview media | forecolor backcolor",
      skin_url: this.skinUrl + 'tinymce/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('init', () => {
          editor.setContent(this.post.text);
        });
        editor.on('keyup', () => {
          this.post.text = editor.getContent();
        });
      }
    });
  }

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  closeMessage(time) {
    setTimeout(() => {
      this.message = null;
      this.messageClass = null;
    }, time);
  }

  editPostSubmit() {
    console.log(this.post);
    this.postService.editPost(this.post).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'edit-post-warning bounceInRight';
        this.message = data.message;
        this.closeMessage(3000);
      } else {
        this.messageClass = 'edit-post-success bounceInRight';
        this.message = data.message;
        this.closeMessage(3000);
      }
    });
  }

  getImagePost(imagePost: any) {
    let target = imagePost.target;
    this.post.image = target.files[0];
  }

  categoryDropDown(value) {
    this.post.category = value;
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.postService.getSinglePost(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'edit-post-warning bounceInRight'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.closeMessage(3000);
      } else {
        this.post = data.post;
        this.post.category = data.post.category; // Save blog object for use in HTML
      }
    });
  }

}
