import {
  Component, 
  OnInit, 
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Input,
  Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from "../services/post.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
declare var tinymce: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;
  message;
  messageClass;
  skinUrl: string = '/assets/';
  editor;
  elementId = 'post-editor';
  content;
  user;
  imagePost;
  selectCategory = 'Please select category';
  category = [
    'Interviews',
    'Video and Audio',
    'Photography',
    'News from around the World',
    'Other Stuff'
  ];

  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['paste', 'table', 'image', 'link', 'preview', 'textcolor', 'print', 'media'],
      toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
      toolbar2: "print preview media | forecolor backcolor",
      skin_url: this.skinUrl + 'tinymce/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup', () => {
          this.content = editor.getContent();
        });
      },
    });
  }

  ngOnDestroy(): void {
    tinymce.remove(this.editor);
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
   }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ])],
      text: ['', Validators.required]
    })
  }
  
  getImagePost(imagePost: any) {
    let target = imagePost.target;
    this.imagePost = target.files[0];
  }

  closeMessage(time) {
    setTimeout(() => {
      this.message = null;
      this.messageClass = null;
    }, time);
  }

  createPostSubmit(){
    const post = {
      foreignKey: this.user._id,
      title: this.form.get('title').value,
      text: this.content,
      image: this.imagePost,
      category: this.selectCategory,
      createdBy: this.user.username
    }
    
    return this.postService.createPost(post).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'post-warning bounceInRight';
        this.closeMessage(3000);
      } else {
        this.message = data.message;
        this.messageClass = 'post-success bounceInRight';
        setTimeout(() => {
          this.router.navigate(['/post/' + data.post._id]);
        }, 1000);
      }
    })
  }


  categoryDropDown(value) {
    this.selectCategory = value;
  }

  ngOnInit() { 
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    })

    
  }

}
