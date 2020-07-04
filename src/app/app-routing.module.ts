import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},

	{
		path: 'login',
		canActivate: [UnauthGuard],
		loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
	},
	{
		path: 'register',
		canActivate: [UnauthGuard],
		loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
	},
	{
		path: 'forgot',
		canActivate: [UnauthGuard],
		loadChildren: () => import('./forgot/forgot.module').then( m => m.ForgotPageModule)
	},
	{
		path: 'users',
		canActivate: [AuthGuard],
		loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
	},
	{
		path: 'details/:id',
		canActivate: [AuthGuard],
		loadChildren: () => import('./user-details/user-details.module').then( m => m.UserDetailsPageModule)
	},

	{
		path: '**',
		redirectTo: 'login'
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
