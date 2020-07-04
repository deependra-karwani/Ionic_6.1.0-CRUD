import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastService } from '../toast.service';
import { RegExService } from '../regex.service';
import { HttpService } from '../http.service';
import { FlagService } from '../flag.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnDestroy {
	constructor(private toast: ToastService, private regex: RegExService, private http: HttpService, private flag: FlagService, private nav: NavController) {}

	email = '';
	password = '';
	confPass = '';

	changePassObserver: Subscription;

	handleSubmit() {
		let {
			regex: { isValidEmail, isValidPassword },
			flag: { startLoading, stopLoading },
			email, password, confPass
		} = this;
		
		if(!isValidEmail(email)) {
			this.toast.simple("Please enter your correct email").subscribe();
			return
		}

		if(!isValidPassword(password)) {
			this.toast.simple("Please enter a valid password").subscribe();
			return
		}

		if(password !== confPass) {
			this.toast.simple("Passwords do not match").subscribe();
			return
		}
		
		startLoading();

		this.changePassObserver = this.http.forgotPasswordReq({email, password})
		.subscribe( (data) => {
			let { message } = data;
			this.toast.simple(message || "Password Changed Successfully").subscribe();
		}, (error) => {
			let { message } = error;
			this.toast.simple(message || "Unexpected Error has Occurred").subscribe();
		}, () => {
			stopLoading();
		});
	}

	navLogin() {
		this.nav.navigateForward('/login');
	}

	ngOnDestroy() {
		if(this.changePassObserver) {
			this.changePassObserver.unsubscribe();
		}
	}
}
