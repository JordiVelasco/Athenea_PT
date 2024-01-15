import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

import { UserService } from '../user.service';
import { User } from "../user";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  users: User[] = [];
  filterValueUsers: User[] = [];
  showForm = true;
  selectedUser: any = {};
  filterNameValue: string = '';
  filterSurnameValue: string = '';
  filterEmailValue: string = '';
  filterIdValue: string = '';
  name: string = '';
  columnaOrdenada: string = '';
  ordenAscendente: boolean = false;
  usersList: any[] = [];

  @ViewChild('table', { static: false }) table!: ElementRef<any>;
  @ViewChild(IonModal) modal!: IonModal;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): any {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.filter();
      });
  }

  ordenarPor() {
    this.usersList = this.getCurrentPageItems();
    this.ordenAscendente = !this.ordenAscendente;
    this.usersList.sort((a, b) => {
      const factor = this.ordenAscendente ? 1 : -1;
      return String(a.name).localeCompare(String(b.name)) * factor;
    });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getCurrentPageItems());
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'usuaris.xlsx');
  }

  exportToPDF(): void {
    const pdf = new jsPDF();
    pdf.text('Llista Usuaris', 10, 10);
    autoTable(pdf, {
      startY: 20,
      head: [['Nom', 'Cognom', 'Email', 'DNI']],
      body: this.filterValueUsers.map(user => [user.name, user.surname, user.email, user.id]),
    });
    pdf.save('usuaris.pdf');
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
    this.filter();
  }

  searchByName(filterName: any): void {
    this.filterNameValue = filterName.target.value;
    this.filter();
  }

  searchBySurname(filterSurname: any): void {
    this.filterSurnameValue = filterSurname.target.value;
    this.filter();
  }

  searchByEmail(filterEmail: any): void {
    this.filterEmailValue = filterEmail.target.value;
    this.filter();
  }

  searchById(filterId: any): void {
    this.filterIdValue = filterId.target.value;
    this.filter();
  }

  filter(): void {
    this.filterValueUsers = this.users.filter(user =>
      user.name.includes(this.filterNameValue) &&
      user.surname.includes(this.filterSurnameValue) &&
      user.email.includes(this.filterEmailValue) &&
      user.id.includes(this.filterIdValue)
    );
  }

  cancel(): void {
    this.modal.dismiss(null, 'cancel');
  }
}
