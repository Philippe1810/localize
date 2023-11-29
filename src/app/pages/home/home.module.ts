import { NgModule, FactoryProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

import { HomePageRoutingModule } from './home-routing.module';


export function geolocationFactory() {
  return Geolocation;
}

const geolocationProvider: FactoryProvider = {
  provide: Geolocation,
  useFactory: geolocationFactory
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [geolocationProvider]
})
export class HomePageModule {}
