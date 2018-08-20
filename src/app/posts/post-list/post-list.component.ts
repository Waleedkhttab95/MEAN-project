import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
totalPosts = 0;
postsPerPage = 2 ;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
private authStatusSub: Subscription;
 userIsAuth = false;
userId: string;
  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
   this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
this.userIsAuth = this.authService.getIsAuth();
    this.authStatusSub =  this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
this.userIsAuth = isAuth;
this.userId = this.authService.getUserId();

    });
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
