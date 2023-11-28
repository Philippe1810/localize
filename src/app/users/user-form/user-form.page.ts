import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { UserService } from './../shared/user.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
  title: string = 'Novo usuário';
  user?: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController) {
      this.user = new User();
     }

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
       if (this.user) {
         const result = await this.userService.save(this.user);
         this.user.id = result.insertId;
   
         const toast = await this.toastCtrl.create({
           header: 'Sucesso',
           message: 'Usuário salvo com sucesso.',
           color: 'success',
           position: 'bottom',
           duration: 3000
         });
         toast.present();
       }
    } catch (error) {
       const toast = await this.toastCtrl.create({
         header: 'Erro',
         message: 'Ocorrreu um erro ao salvar o usuário.',
         color: 'danger',
         position: 'bottom',
         duration: 3000
       });
       toast.present();
    }
   }
}
