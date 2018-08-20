import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

const BackUrl = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number , currentPage: number) {
    const queryParms = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(
        BackUrl + queryParms
      )
      .pipe(map((postData) => {
        return {posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
      maxPosts: postData.maxPosts};
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({posts: [...this.posts],
        postCount: transformedPosts.maxPosts
      });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
const postData = new FormData();
postData.append('title', title);
postData.append('content', content);
postData.append('image', image, title);
    this.http
      .post<{ message: string, post: Post }>(BackUrl, postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
   return this.http.delete(BackUrl +  postId);
  }

  getPost(id: string) {
return this.http.get<{_id: string ,
   title: string,
    content: string,
     imagePath: string,
    creator: string}>
(BackUrl + id);
  }

  updatePost(id: string , title: string , content: string, image: File | string) {
let postData: Post | FormData;
    // tslint:disable-next-line:quotemark
    if (typeof image === "object") {
   postData = new FormData();
  postData.append('id', id);
  postData.append('title', title);
  postData.append('content', content);
  postData.append('image', image, title);
}  else {
 postData = {
   id: id,
   title: title,
    content: content,
     imagePath: image,
     creator: null
    };
}

this.http.put(BackUrl + id, postData)
.subscribe(response => {
  this.router.navigate(['/']);
});
  }
}
