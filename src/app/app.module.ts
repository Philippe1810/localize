import { NgModule, FactoryProvider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { BackgroundGeolocation } from '@awesome-cordova-plugins/background-geolocation/ngx';

import { SMS } from '@awesome-cordova-plugins/sms/ngx';


export function geolocationFactory() {
  return Geolocation;
}

const geolocationProvider: FactoryProvider = {
  provide: Geolocation,
  useFactory: geolocationFactory
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    geolocationProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    SQLitePorter,
    SplashScreen,
    // Altere a declaração do StatusBar para o AwesomeStatusBar
    { provide: StatusBar },
    BackgroundGeolocation,
    SMS
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}