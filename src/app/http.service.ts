import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

	baseUrl = "http://localhost:3600/user/";
	// baseUrl = "http://localhost:8080/user/";
	
	constructor(private http:HttpClient) {}

	/** Session Management */
	setUId = (userid) => {
		localStorage.setItem('userid', userid);
	}

	getUId = () => {
		return localStorage.getItem('userid');
	}

	rmUId = () => {
		localStorage.removeItem('userid');
	}

	saveSession = (token) => {
		localStorage.setItem('unsafe', token);
	}

	getSession = () => {
		return localStorage.getItem('unsafe');
	}

	rmSession = () => {
		localStorage.removeItem('unsafe');
	}

	persistLogin = (userid, token) => {
		localStorage.setItem('userid', userid);
		localStorage.setItem('unsafe', token);
	}
	
	persistLogout = () => {
		localStorage.removeItem('userid');
		localStorage.removeItem('unsafe');
	}

	isLoggedIn = () => {
		return Boolean(this.getSession());
	}
	/** ~Session Management */

	registerReq = (formData) => {
		return this.http.post<any>(this.baseUrl+"register", formData, {observe: 'response'});
	}

	loginReq = (data) => {
		return this.http.put<any>(this.baseUrl+"login", data, {observe: 'response'});
	}

	forgotPasswordReq = (data) => {
		return this.http.put<any>(this.baseUrl+"forgot", data);
	}

	logoutReq = (token) => {
		const headers = new HttpHeaders({token});
		return this.http.get<any>(this.baseUrl+"logout", {headers})
	}

	getAllUsersReq = (params) => {
		return this.http.get<any>(this.baseUrl+"getAll", {params});
	}

	getUserDetailsReq = (params) => {
		return this.http.get<any>(this.baseUrl+"getDetails", {params});
	}

	updateProfileReq = (formData) => {
		return this.http.put<any>(this.baseUrl+"updProf", formData);
	}

	deleteAccountReq = (data) => {
		return this.http.request<any>('delete', this.baseUrl+"delAcc", {body: data});
		// return this.http.delete(this.baseUrl+"delAcc", {body: data});
	}

	refreshTokenReq = (token) => {
		const headers = new HttpHeaders({token});
		return this.http.get<any>(this.baseUrl+"refresh", {headers});
	}
}
