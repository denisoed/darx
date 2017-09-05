import { ProfileComponent } from './profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BlogSidebarComponent, EscapeHtmlPipe, SlicePipe } from './blog-sidebar/blog-sidebar.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { NewsComponent } from './news/news.component';
import { FeaturesComponent } from './features/features.component';
import { Error404Component } from './error404/error404.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notAuth.guard";
import { SinglePostComponent } from './single-post/single-post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { PostService } from "./services/post.service";
import { EditPostComponent } from './edit-post/edit-post.component';
import { DeletePostComponent } from './delete-post/delete-post.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BlogSidebarComponent,
    HomeComponent,
    ContactComponent,
    NewsComponent,
    FeaturesComponent,
    Error404Component,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    SidebarComponent,
    SinglePostComponent,
    AddPostComponent,
    EscapeHtmlPipe,
    SlicePipe,
    EditPostComponent,
    DeletePostComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [ AuthService, AuthGuard, NotAuthGuard, PostService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
