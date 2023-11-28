import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserFormPageModule } from './users/user-form/user-form.module';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'contacts', loadChildren: () => import('./pages/contact-list/contact-list.module').then( m => m.ContactListPageModule)},
  { path: 'contacts/new', loadChildren: () => import('./pages/contact-form/contact-form.module').then( m => m.ContactFormPageModule)},
  { path: 'contacts/edit/:id', loadChildren: () => import('./pages/contact-form/contact-form.module').then( m => m.ContactFormPageModule)},
  { path: 'user-form', loadChildren: () => import('./users/user-form/user-form.module').then( m => m.UserFormPageModule)},
  { path: 'user-list', loadChildren: () => import('./users/user-list/user-list.module').then( m => m.UserListPageModule)},
  { path: 'users/new', loadChildren: () => import('./users/user-form/user-form.module').then( m => m.UserFormPageModule)},
  { path: 'users/edit/:id', loadChildren: () => import('./users/user-form/user-form.module').then( m => UserFormPageModule)}
  //preciso conferir as linhas 13, 14, 15 e 16

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
