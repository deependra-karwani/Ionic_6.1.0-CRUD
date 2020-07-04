import { Injectable } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';
import { Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	constructor(private toast: Toast) {}
	
	simple = (message) => {
		return this.toast.show(message, '3000', 'bottom');
	}
}
