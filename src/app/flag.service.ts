import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
	constructor() {}

	loading = false;

	startLoading = () => {
		this.loading = true;
	}

	stopLoading = () => {
		this.loading = false;
	}
}
