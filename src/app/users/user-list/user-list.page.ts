import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/user.service';
import { User } from './../shared/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private toastctrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.loadUsers();
  }

  async loadUsers(){
    this.users = await this.userService.getAll();
  }

  doSearchClear() {
    this.loadUsers();
  }

  async doSearchbarChange($event: any) {
    const value = $event.target.value;
    if(value && value.length >= 2) {
      this.users = await this.userService.filter(value);
    }
  }

  async delete(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Deletar?',
      message: `Deseja excluir o usuário: ${user.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.executeDelete(user);
          }
        }
      ]
    });
  }

  async executeDelete(user: User) {
    try {
      await this.userService.delete(Number(user.id));

      const index = this.users.indexOf(user);
      this.users.splice(index, 1);

      const toast = await this.toastctrl.create({
        header: 'Sucesso',
        message: 'Usuário excluído com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });
      toast.present();

    } catch (error) {
      const toast = await this.toastctrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao excluir o usuário.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }
  }
}