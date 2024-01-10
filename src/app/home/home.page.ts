import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

import { UserService } from '../user.service';
import { User } from "../user";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  users: User[] = [];
  newUser: any[] = [];
  filterValueUsers: User[] = [];
  showForm = true;
  selectedUser: any = {};
  filterNameValue: string = '';
  filterSurnameValue: string = '';
  filterEmailValue: string = '';
  filterIdValue: string = '';
  name: string = '';

  @ViewChild('table', { static: false }) table!: ElementRef<any>;
  @ViewChild(IonModal) modal!: IonModal;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }
  
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.addUser();
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getCurrentPageItems());
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }

  exportToPDF(): void {
    const data = this.table.nativeElement;

    const pdf = new jsPDF();

    pdf.text('Llista Usuaris', 10, 10);

    autoTable(pdf, {startY: 20,
      head: [['Nom', 'Cognom', 'Email', 'DNI']],
      body: this.filterValueUsers.length !== 0 ? this.filterValueUsers.map(user => [user.name, user.surname, user.email, user.id]) : this.users.map(user => [user.name, user.surname, user.email, user.id]),
    })

    pdf.save('usuarios.pdf');
  }

  getCurrentPageItems(): User[] {
    return this.filterValueUsers.length !== 0 ? this.filterValueUsers : this.users;
  }

  addUser(): void {
    this.showForm = true;
  }

  confirm(): void {
    this.modal.dismiss(this.name, 'confirm');
    this.userService.addUser(this.selectedUser);
    this.users = [...this.users, { ...this.selectedUser }];
    this.selectedUser = {};
    this.showForm = true;
  }
  
  searchByName(filterName: any): any{
    this.filterNameValue = filterName.target.value;
    this.filter();
  }
  searchBySurname(filterSurname: any): any{
    this.filterSurnameValue = filterSurname.target.value;
    this.filter();
  }
  searchByEmail(filterEmail: any): any{
    this.filterEmailValue = filterEmail.target.value;
    this.filter();
  }
  searchById(filterId: any): any{
    this.filterIdValue = filterId.target.value;
    this.filter();
  }

  filter(): void{
    this.filterValueUsers = this.users.filter( user => 
      user.name.includes(this.filterNameValue) && 
      user.surname.includes(this.filterSurnameValue)&& 
      user.name.includes(this.filterEmailValue) && 
      user.id.includes(this.filterIdValue)
    )   
  }

  cancel(): void { 
    this.selectedUser = {}; 
    this.showForm = false;
  }
}
