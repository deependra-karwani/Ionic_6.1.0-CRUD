import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ToastService } from '../toast.service';
import { HttpService } from '../http.service';
import { HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnDestroy {
	constructor(private toast: ToastService, private nav: NavController, private http: HttpService) {}

	users;
	getAllObserver: Subscription;

	ngOnInit(): void {
		let {
			http: { getUId }
		} = this;

		let params = new HttpParams();
		params = params.append('userid', getUId());

		this.getAllObserver = this.http.getAllUsersReq(params)
		.subscribe( (data) => {
			data.message ?
				this.toast.simple(data.message).subscribe()
			:
				this.users = data.users;			
		}, (error) => {
			this.toast.simple(error.message || "Unexpected Error has Occurred").subscribe();
		});
	}

	navigateDetails(userid) {
		this.nav.navigateForward('/details/'+userid);
	}

	ngOnDestroy() {
		if(this.getAllObserver) {
			this.getAllObserver.unsubscribe();
		}
	}
}
