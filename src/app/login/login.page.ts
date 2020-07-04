import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastService } from '../toast.service';
import { RegExService } from '../regex.service';
import { HttpService } from '../http.service';
import { FlagService } from '../flag.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy {
	constructor(private toast: ToastService, private regex: RegExService, private http: HttpService, private flag: FlagService, private nav: NavController) {}

	username = '';
	password = '';

	loginObserver: Subscription;

	handleSubmit() {
		let {
			regex: { isValidUsername, isValidPassword },
			http: { persistLogin },
			flag: { startLoading, stopLoading },
			username, password,
			nav: { navigateRoot }
		} = this;

		if(!isValidUsername(username)) {
			this.toast.simple("Please enter your correct username").subscribe();
			return
		}

		if(!isValidPassword(password)) {
			this.toast.simple("Please enter your correct password").subscribe();
			return
		}
		
		startLoading();
		this.loginObserver = this.http.loginReq({username, password})
		.subscribe( (data) => {
			let { message, userid } = data.body;
			persistLogin(userid, data.headers['token']);
			this.toast.simple(message || "Login Successful").subscribe();
			navigateRoot('/users');
		}, (error) => {
			let { message } = error;
			this.toast.simple(message || "Unexpected Error has Occurred").subscribe();
		}, () => {
			stopLoading();
		});
	}

	navRegister = () => {
		this.nav.navigateForward('/register');
	}

	navForgot = () => {
		this.nav.navigateForward('/forgot');
	}

	ngOnDestroy() {
		if(this.loginObserver) {
			this.loginObserver.unsubscribe();
		}
	}
}
