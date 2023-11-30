import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from './../shared/user';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})

export class UserFormPage implements OnInit {
  title: string = 'Novo usuário';
  user: User = new User();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toasCtrl: ToastController,
    private navCtrl: NavController) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.title = 'Editar usuário';
      this.loadUser(parseInt(idParam));
    }
  }

  async loadUser(id: number) {
    this.user = await this.userService.getById(id);
  }

  async onSubmit() {

    try {
      const existingUser = await this.userService.getAll();

      if (existingUser.length > 0) {
        const toast = await this.toasCtrl.create({
          header: 'Aviso',
          message: 'Já existe usuário cadastrado!',
          color: 'warning',
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      } else {
        await this.userService.save(this.user);

        const toast = await this.toasCtrl.create({
          header: 'Sucesso',
          message: 'Usuário salvo com sucesso!',
          color: 'success',
          position: 'bottom',
          duration: 3000
        });
        toast.present();
      }

    } catch (error: any) {
      const toast = await this.toasCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao salvar o usuário: ' + error.message,
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }

    /*
    try {
      await this.userService.save(this.user);

      const toast = await this.toasCtrl.create({
        header: 'Sucesso',
        message: 'Usuário salvo com sucesso',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });
      toast.present();

    } catch (error: any) {
      const toast = await this.toasCtrl.create({
         header: 'Erro',
         message: 'Ocorreu um erro ao tentar salvar o usuário: ' + error.message,
         color: 'danger',
         position: 'bottom',
         duration: 3000
      });
      toast.present();
     }
  }

  goToHomePage() {
    this.navCtrl.navigateRoot('/home');
  }
  */
  }

  goToHomePage() {
    this.navCtrl.navigateRoot('/home');
  }
  
}
