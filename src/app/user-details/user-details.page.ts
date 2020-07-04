import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../toast.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';
import { FlagService } from '../flag.service';
import { HttpParams } from '@angular/common/http';
import { RegExService } from '../regex.service';
import { NavController, AlertController } from '@ionic/angular';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit, OnDestroy {
	constructor(private ar: ActivatedRoute, private nav: NavController, private toast: ToastService, private http: HttpService, private flag: FlagService, private regex: RegExService, public alert: AlertController) {}

	id;
	name;
	username;
	email;
	mobile;
	profPic;
	profPicChanged;
	isUser;

	getDetailsObserver: Subscription;
	updProfObserver: Subscription;
	logoutObserver: Subscription;
	delProfObserver: Subscription;

	ngOnInit(): void {
		this.ar.params.subscribe( (params) => {
			this.id = params.id;
			if(params.id) {
				this.id = params.id;
				this.isUser = false;
			} else {
				this.id = this.http.getUId();
				this.isUser = true;
			}
			let req = new HttpParams();
			req = req.append('userid', this.id);
			this.getDetailsObserver = this.http.getUserDetailsReq(req)
			.subscribe( (data) => {
				// this = {...this, ...data};
				this.profPic = data.profpic;
				this.name = data.name;
				this.username = data.username;
				this.email = data.email;
				this.mobile = data.mobile;
			}, (error) => {
				this.toast.simple(error.message || "Could not Fetch User Details").subscribe();
			});
		});
	}

	async handleSubmit() {
		let {
			regex: { isValidName, isValidMobile, isValidUsername },
			http: { getUId },
			flag: { startLoading, stopLoading },
			name, username, mobile, profPic, profPicChanged
		} = this;
		
		if(this.id !== getUId()) {
			return
		}
		
		if(!isValidName(name)) {
			this.toast.simple("Please enter your name").subscribe();
			return
		}

		if(!isValidUsername(username)) {
			this.toast.simple("Please enter a valid username").subscribe();
			return
		}

		if(!isValidMobile(mobile)) {
			this.toast.simple("Please enter your mobile number").subscribe();
			return
		}

		startLoading();
		let formData = new FormData();
		formData.append('name', name);
		formData.append('username', username);
		formData.append('mobile', mobile);
		if(profPicChanged) {
			const blob = await fetch(profPic).then(r => r.blob());
			formData.append('prof', blob);
		}
		this.updProfObserver = this.http.updateProfileReq(formData)
		.subscribe( (data) => {
			this.toast.simple(data.message || "Profile Updated Successfully").subscribe();
		}, (error) => {
			this.toast.simple(error.message || "Unexpected Error has Occurred").subscribe();
		}, () => {
			stopLoading();
		});
	}

	confLogout = async () => {
		const alert = await this.alert.create({
			header: 'Are you sure you want to Logout?',
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => null
				},
				{
					text: 'Yes',
					handler: this.logout
				}
			]
		  });
	  
		  await alert.present();
	}

	logout() {
		let {
			http: { getUId, getSession, persistLogout },
			flag: { startLoading, stopLoading },
			nav: { navigateRoot }
		} = this;

		if(this.id === getUId() && window.confirm("Are you sure you want to logout?")) {
			startLoading();

			this.logoutObserver = this.http.logoutReq(getSession())
			.subscribe( (data) => {
				this.toast.simple(data.message || "Logout Successful").subscribe();
				persistLogout();
				navigateRoot('/login');
			}, (error) => {
				this.toast.simple(error.message || "Unexpected Error has Occurred").subscribe();
			}, () => {
				stopLoading();
			});
		}
	}

	confDelProf = async () => {
		const alert = await this.alert.create({
			header: 'Are you sure?',
			message: 'This action is not reversible',
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => null
				},
				{
					text: 'Yes',
					handler: this.delProf
				}
			]
		  });
	  
		  await alert.present();
	}

	delProf() {
		let {
			http: { getUId, persistLogout },
			flag: { startLoading, stopLoading },
			nav: { navigateRoot }
		} = this;

		if(this.id === getUId() && window.confirm("Are you sure you want to logout?")) {
			startLoading();

			this.delProfObserver = this.http.deleteAccountReq({userid: this.id})
			.subscribe( (data) => {
				this.toast.simple(data.message || "Profile Deleted Successfully").subscribe();
				persistLogout();
				navigateRoot('/login');
			}, (error) => {
				this.toast.simple(error.message || "Unexpected Error has Occurred").subscribe();
			}, () => {
				stopLoading();
			});
		}
	}

	async handleFile() {
		const image = await Camera.getPhoto({
			quality: 100,
			allowEditing: false,
			resultType: CameraResultType.Uri,
			source: CameraSource.Photos
		});

		this.profPic = image.webPath;
	}

	ngOnDestroy() {
		if(this.getDetailsObserver) {
			this.getDetailsObserver.unsubscribe();
		}
		if(this.updProfObserver) {
			this.updProfObserver.unsubscribe();
		}
		if(this.logoutObserver) {
			this.logoutObserver.unsubscribe();
		}
		if(this.delProfObserver) {
			this.delProfObserver.unsubscribe();
		}
	}
}
