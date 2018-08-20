import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscribable, Subscription } from 'rxjs';

@Component({
selector: 'app-header',
templateUrl: './header.component.html',
styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
private authListenerSubs: Subscription;
userAuthentecated = false;
  constructor(private authService: AuthService) {}

ngOnInit() {
  this.userAuthentecated = this.authService.getIsAuth();
this.authListenerSubs = this.authService.getAuthStatusListener()
.subscribe(isAuth => {
  this.userAuthentecated = isAuth;
});
}

onLogout() {
this.authService.logOut();
}

ngOnDestroy() {
this.authListenerSubs.unsubscribe();
}
}
