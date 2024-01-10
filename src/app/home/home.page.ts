import { Component, OnInit } from '@angular/core';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  searchUser(): void {
  }

  addUser(): void {
    this.showForm = true;
  }

  saveUser(): void {
    console.log(this.selectedUser);
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
