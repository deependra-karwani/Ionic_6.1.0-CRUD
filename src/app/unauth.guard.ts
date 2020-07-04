import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
	
	constructor(private http: HttpService, private nav: NavController) {}

	canActivate(
	next: ActivatedRouteSnapshot,
	state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if(this.http.isLoggedIn()) {
			this.nav.navigateRoot('/users');
			return false;
		} else {
			return true;
		}
	}
}