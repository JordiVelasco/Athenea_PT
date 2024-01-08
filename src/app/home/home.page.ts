import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.loadUsersFromJson().subscribe(
      (data) => {
        this.userService.setUsers(data);
        this.users = this.userService.getAllUsers();
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }
}
