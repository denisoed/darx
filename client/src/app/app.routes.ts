import { Routes } from "@angular/router";

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BlogSidebarComponent } from './blog-sidebar/blog-sidebar.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { NewsComponent } from './news/news.component';
import { FeaturesComponent } from './features/features.component';
import { Error404Component } from './error404/error404.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notAuth.guard";
import { AddPostComponent } from "./add-post/add-post.component";
import { SinglePostComponent } from "./single-post/single-post.component";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { DeletePostComponent } from "./delete-post/delete-post.component";


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'blog',
    component: BlogSidebarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'features',
    component: FeaturesComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-new-post',
    component: AddPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    component: SinglePostComponent, 
    canActivate: [AuthGuard] // User must be logge din to view this route
  },
  {
    path: 'edit-post/:id',
    component: EditPostComponent, 
    canActivate: [AuthGuard] // User must be logge din to view this route
  },
  {
    path: 'delete-post/:id',
    component: DeletePostComponent, 
    canActivate: [AuthGuard] // User must be logge din to view this route
  },
  {
    path: '**',
    component: Error404Component
  }
]