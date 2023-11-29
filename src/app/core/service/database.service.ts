import { Injectable } from '@angular/core';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
 providedIn: 'root'
})
export class DatabaseService {
 db?: SQLiteObject;
 databaseName: string = 'Localize.db';

 constructor(private sqlite: SQLite, private sqlitePorter: SQLitePorter) { }

 async openDatabase() {
  try {
     this.db = await this.sqlite.create({ name: this.databaseName, location: 'default' });
     await this.createDatabase();
  } catch (error) {
     console.error('Ocorreu um erro ao criar o banco de dados', error);
  }
 }
 
 async createDatabase() {
  const sqlCreateDatabase = this.getCreateTable();
  const result = await this.sqlitePorter.importSqlToDb(this.db, sqlCreateDatabase);
  return result ? true : false;
 }
 
 
 getCreateTable() {
  const sqls: string[] = [];
  sqls.push('CREATE TABLE IF NOT EXISTS contacts (id integer primary key AUTOINCREMENT, name text, phoneNumber text);');
  return sqls.join('\n');
 }

 async executeSQL(sql: string, params?: any[]) {
  if (this.db) {
      const sqlNew = sql.replace(/name/g, 'firstname');
      return this.db.executeSql(sqlNew, params);
  } else {
      throw new Error('O banco de dados não foi inicializado.');
  }
}
}