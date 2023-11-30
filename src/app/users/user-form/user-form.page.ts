import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from './../shared/user';

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
    private toasCtrl: ToastController) { }

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
}
