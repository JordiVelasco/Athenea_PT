import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from "./user";

@Injectable({
    providedIn: 'root'
  })

export class UserService  {

  private user: any[] = [];
  private usersUrl = 'assets/users.json';

  constructor(private http: HttpClient) { }

  addUser(user: any): void {
    this.user = [...this.user, user];
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
  }

  getUser(id: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => {
        const user = users.find(u => u.id === id);
        if (!user) {
          return this.user.find(u => u.id === id);
        }
        return user;
      })
    );
  }
}
