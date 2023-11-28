import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListPage } from './contact-list.page';

describe('ContactListPage', () => {
  let component: ContactListPage;
  let fixture: ComponentFixture<ContactListPage>;

  beforeEach(() => { //beforeEach(async(() => { -alterei esta parte
    fixture = TestBed.createComponent(ContactListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
