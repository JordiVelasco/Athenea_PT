import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from "./user";

@Injectable({
    providedIn: 'root'
  })

export class UserService  {

  private usersUrl = 'assets/users.json';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
  }

  getUser(id: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => {
        const user = users.find(u => u.id.toString() === id.toString());
        if (!user) {
          throw new Error(`User with DNI ${id} not found`);
        }
        return user;
      })
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.usersUrl, user);
  }

}
