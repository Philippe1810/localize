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
    const sql = 'insert into users (name) values (?)';
    const data = [user.name];
    return this.db.executeSQL(sql, data);
  }

  private update(user: User) {
    const sql = 'update users set name = ? where id = ?';
    const data = [user.name, user.id];
    return this.db.executeSQL(sql, data);
  }

  delete(id: number) {
    const sql = 'delete from users where id = ?';
    const data = [id];
    return this.db.executeSQL(sql, data);
  }

  async getById (id: number) {
    const sql = 'select * from contacts where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const user = new User();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      user.id = item.id;
      user.name = item.name;
    }
    return user;
  }

  async getAll() {
    const sql = 'select * from users';
    const result = await this.db.executeSQL(sql);
    const users = this.fillUsers(result.rows);
    return users;
  }

  async filter (text: string) {
    const sql = 'select * from users where name like ?';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const users = this.fillUsers(result.rows);
    return users;
  }

  private fillUsers(rows: any) {
    const users: User[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows. item(i);
      const user = new User();
      user.id = item.id;
      user.name = item.name;
      users.push(user);
    }
    return users;
  }
}
