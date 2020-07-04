import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FlagService } from './flag.service';
import { Plugins } from '@capacitor/core';
import { HttpService } from './http.service';
const { SplashScreen:Splash } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
	private statusBar: StatusBar,
	public flag: FlagService,
	public local: HttpService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
	  this.splashScreen.hide();
	  Splash.hide();
    });
  }
}
