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
  editor;
  elementId = 'post-editor';
  content;
  username;

  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['paste', 'table', 'image', 'link', 'preview', 'textcolor', 'print', 'media'],
      toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
      toolbar2: "print preview media | forecolor backcolor",
      skin_url: 'assets/tinymce/skins/lightgray',
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
    private authService: AuthService
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
      text: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  createPostSubmit(){
    const post = {
      title: this.form.get('title').value,
      text: this.content,
      createdBy: this.username
    }
    
    return this.postService.createPost(post).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'post-warning'
      } else {
        this.message = data.message;
        this.messageClass = 'post-success'
      }
    })
  }

  ngOnInit() { 
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    })
  }

}
