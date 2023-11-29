import { Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/service/database.service';
import { Contact } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private db: DatabaseService) { }

  save(contact: Contact) {
    if (Number(contact.id) > 0) { //precisei converter para número
      return this.update(contact);
    } else {
      return this.insert(contact);
    }
  }

  private insert(contact: Contact) {
    const sql = 'INSERT INTO contacts (name, phoneNumber) VALUES (?, ?)';
    const data = [contact.name, contact.phoneNumber];
  
    return this.db.executeSQL(sql, data);
  }

  private update(contact: Contact) {
    const sql = 'UPDATE contacts SET name = ?, phoneNumber = ? WHERE id = ?';
    const data = [contact.name, contact.phoneNumber, contact.id];
  
    return this.db.executeSQL(sql, data);
  }

  delete (id: number) {
    const sql = 'delete from contacts where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }

  async getById (id: number) {
    const sql = 'select * from contacts where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const contact = new Contact();
    if (result.rows && result.rows.length > 0) { //inseri o result antes do rows
      const item = result.rows.item(0);
      contact.id = item.id;
      contact.name = item.name;
      contact.phoneNumber = item.phoneNumber;
    }
    return contact;
  }

  async getAll() {
    const sql = 'select * from contacts';
    const result = await this.db.executeSQL(sql);
    const contacts = this.fillContacts(result.rows);
    return contacts;
  }

  async filter (text: string) {
    const sql = 'select * from contacts where name like ?';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const contacts = this.fillContacts(result.rows);
    return contacts;
  }

  private fillContacts(rows: any) {
    const contacts: Contact[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows. item(i);
      const contact = new Contact();
      contact.id = item.id;
      contact.name = item.name;
      contact.phoneNumber = item.phoneNumber;
      contacts.push(contact);
    }
    return contacts;
  }
}