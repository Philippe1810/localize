import { Component } from '@angular/core';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { DatabaseService } from './core/service/database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: DatabaseService,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      const loading = await this.loadingController.create({
        message: 'Carregando...'
      });

      await loading.present();

      try {
        await this.db.openDatabase();
        console.log('Banco de dados aberto com sucesso!');
      } catch (error) {
        console.error('Erro ao abrir o banco de dados:', error);
      } finally {
        await loading.dismiss();
      }
    });
  }
}
