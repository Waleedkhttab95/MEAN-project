import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
templateUrl: './signup.component.html',
styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
isLoading = false;
private authStatusSub: Subscription;
constructor(public authService: AuthService) {}

ngOnInit() {
 this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
   authStatus => {
     this.isLoading = false;
   }
 );
}

ngOnDestroy() {
this.authStatusSub.unsubscribe();
}
onSignup(form: NgForm) {
  if (form.invalid) {
    return;
  }
this.authService.createUser(form.value.email, form.value.password);
}
}
