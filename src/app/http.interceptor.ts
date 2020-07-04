import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable, BehaviorSubject, of } from "rxjs";
import { catchError, filter, take, switchMap, finalize } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private refreshing = false;
	private refreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		req = this.addAuth(req);

		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error && error.status === 401) {
					if (this.refreshing) {
						return this.refreshSubject.pipe(
							filter(result => result !== null),
							take(1),
							switchMap(() => next.handle(this.addAuth(req)))
						);
					} else {
						this.refreshing = true;

						this.refreshSubject.next(null);

						return this.refreshAuth().pipe(
							switchMap((success: boolean) => {               
								this.refreshSubject.next(success);
								return next.handle(this.addAuth(req));
							}),
							finalize(() => this.refreshing = false)
						);
					}
				} else {
					return throwError(error);
				}
			})
		);
	}

	private refreshAuth(): Observable<any> {
		return of(true);
	}

	private addAuth(request: HttpRequest<any>): HttpRequest<any> {
		const token = localStorage.getItem('unsafe');
		if (!token) {
			return request;
		}
		return request.clone({
			headers: request.headers.set("token", token)
		});
	}
}