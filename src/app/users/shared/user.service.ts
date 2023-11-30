import { Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/service/database.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: DatabaseService) { }

  save(user: User) {
    if (Number(user.id) > 0) {
      return this.update(user);
    } else {
      return this.insert(user);
    }
  }

  private insert(user: User) {
    const sql = 'INSERT INTO user (name, phoneNumber) VALUES (?, ?)';
    const data = [user.name, user.phoneNumber];
  
    return this.db.executeSQL(sql, data);
  }

  private update(user: User) {
    const sql = 'UPDATE user SET name = ?, phoneNumber = ? WHERE id = ?';
    const data = [user.name, user.phoneNumber, user.id];
  
    return this.db.executeSQL(sql, data);
  }

  delete (id: number) {
    const sql = 'delete from user where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }

  async getById (id: number) {
    const sql = 'select * from user where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const user = new User();
    if (result.rows && result.rows.length > 0) {
      const item = result.rows.item(0);
      user.id = item.id;
      user.name = item.name;
      user.phoneNumber = item.phoneNumber;
    }
    return user;
  }

  async getAll() {
    const sql = 'select * from user';
    const result = await this.db.executeSQL(sql);
    const users = this.fillUser(result.rows);
    return users;
  }

  async filter (text: string) {
    const sql = 'select * from user where name like ?';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const users = this.fillUser(result.rows);
    return users;
  }

  private fillUser(rows: any) {
    const users: User[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows. item(i);
      const user = new User();
      user.id = item.id;
      user.name = item.name;
      user.phoneNumber = item.phoneNumber;
      users.push(user);
    }
    return users;
  }
}