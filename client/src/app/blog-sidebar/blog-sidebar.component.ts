import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { PostService } from "../services/post.service";
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  transform(text: string): string {
    return text.toString().slice(0, 300) + '...';
  }

}

@Pipe({ name: 'keepHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(content) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}

@Component({
  selector: 'app-blog-sidebar',
  templateUrl: './blog-sidebar.component.html',
  styleUrls: ['./blog-sidebar.component.css']
})
export class BlogSidebarComponent implements OnInit {

  posts;
  singlePost;
  currentUrl;

  constructor(
    private postService: PostService
  ) { }

  getAllPost() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data.posts;
    });
  }

  ngOnInit() {
    this.getAllPost();
  }

}
