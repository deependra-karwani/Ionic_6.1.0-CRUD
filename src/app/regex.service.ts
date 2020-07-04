import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegExService {
	constructor() {}

	isValidUsername(value) {
		return /^\w{3,}$/.test(value);
	}

	isValidPassword(value) {
		return /^.{4,}$/.test(value);
	}

	isValidName(value) {
		return /^\w[\w\s]{1,}$/.test(value);
	}

	isValidEmail(value) {
		return /^\w.+@\w+\.\w{2,5}$/.test(value);
	}

	isValidMobile(value) {
		return /^([6-9]\d{9})?$/.test(value);
	}
}
