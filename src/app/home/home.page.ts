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
  filterValue = '';
  showForm = true;
  selectedUser: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  searchUser(): void {
    this.users = this.userService.searchService(this.filterValue);
  }

  addUser(): void {
    this.showForm = true;
  }

  saveUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser);
    } else {
      this.userService.addUser(this.selectedUser);
    }
    this.selectedUser = {};
    this.users = this.userService.getAllNewUsers();
    this.showForm = false;
  }

  cancel(): void { 
    this.selectedUser = {}; 
    this.showForm = false;
  }
}
