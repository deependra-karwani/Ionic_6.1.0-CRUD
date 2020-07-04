import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastService } from '../toast.service';
import { RegExService } from '../regex.service';
import { HttpService } from '../http.service';
import { FlagService } from '../flag.service';
import { NavController } from '@ionic/angular';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnDestroy {
	constructor(private toast: ToastService, private regex: RegExService, private http: HttpService, private flag: FlagService, private nav: NavController) {}

	name = '';
	username = '';
	email = '';
	mobile = '';
	password = '';
	confPass = '';
	profPic;
	profPicChanged = false;

	registerObserver: Subscription;

	async handleSubmit() {
		let {
			regex: { isValidName, isValidUsername, isValidEmail, isValidMobile, isValidPassword },
			http: { persistLogin },
			flag: { startLoading, stopLoading },
			name, username, email, mobile, password, confPass, profPic, profPicChanged,
			nav: { navigateRoot }
		} = this;
		
		if(!isValidName(name)) {
			this.toast.simple("Please enter your name").subscribe();
			return
		}

		if(!isValidUsername(username)) {
			this.toast.simple("Please enter a valid username").subscribe();
			return
		}

		if(!isValidEmail(email)) {
			this.toast.simple("Please enter your correct email").subscribe();
			return
		}

		if(mobile && !isValidMobile(mobile)) {
			this.toast.simple("Please enter your correct contact mobile number").subscribe();
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

		let formData = new FormData();
		formData.append('name', name);
		formData.append('username', username);
		formData.append('email', email);
		formData.append('mobile', mobile);
		formData.append('password', password);
		if(profPicChanged) {
			const blob = await fetch(profPic).then(r => r.blob());
			formData.append('prof', blob);
		}
		this.registerObserver = this.http.registerReq(formData)
		.subscribe( (data) => {
			let { message, userid } = data.body;
			persistLogin(userid, data.headers['token']);
			this.toast.simple(message || "Registration Successful").subscribe();
			navigateRoot('/users');
		}, (error) => {
			let { message } = error;
			this.toast.simple(message || "Unexpected Error has Occurred").subscribe();
		}, () => {
			stopLoading();
		});
	}

	async handleFile() {
		// this.imagePicker.getPictures({
		// 	maximumImagesCount: 1,
		// 	allow_video: false
		// }).then( ([result]) => {
		// 	this.profPic = result;
		// 	this.profPicChanged = true;
		// }).catch( () => {
		// 	this.toast.simple("Could not Read Picture. Please Try Again.").subscribe();
		// });

		const image = await Camera.getPhoto({
			quality: 100,
			allowEditing: false,
			resultType: CameraResultType.Uri,
			source: CameraSource.Photos
		});

		this.profPic = image.webPath;
	}

	navLogin() {
		this.nav.navigateForward('/login');
	}

	ngOnDestroy() {
		if(this.registerObserver) {
			this.registerObserver.unsubscribe();
		}
	}
}
