import { Component, OnInit } from '@angular/core';
import { Contact } from '../shared/contact';
import { ContactService } from '../shared/contact.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.page.html',
  styleUrls: ['./contact-form.page.scss'],
})
export class ContactFormPage implements OnInit {
  title: string = 'Novo contato';
  contact: Contact = new Contact(); //alterado

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private toasCtrl: ToastController) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.title = 'Editar contato';
      this.loadContact(parseInt(idParam));
    }
  }

  async loadContact(id: number) {
    this.contact = await this.contactService.getById(id);
  }

  async onSubmit() {
    try {
      await this.contactService.save(this.contact);

      const toast = await this.toasCtrl.create({
        header: 'Sucesso',
        message: 'Contato salvo com sucesso',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });
      toast.present();

    } catch (error) {
      const toast = await this.toasCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar salvar o contato',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }
  }
}
