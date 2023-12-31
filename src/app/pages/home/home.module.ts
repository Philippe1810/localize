import { NgModule, FactoryProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { SMS } from '@ionic-native/sms/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [SMS, Geolocation]
})
export class HomePageModule {}
