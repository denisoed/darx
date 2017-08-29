import { ProfileComponent } from './profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BlogSidebarComponent, EscapeHtmlPipe } from './blog-sidebar/blog-sidebar.component';
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
    EscapeHtmlPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ AuthService, AuthGuard, NotAuthGuard, PostService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
