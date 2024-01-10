import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from "./user";

@Injectable({
    providedIn: 'root'
  })

export class UserService  {

  private user: any[] = [];
  private usersUrl = 'assets/users.json';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllNewUsers(): any[] {
    return this.user;
  }

  getUserId(id: number): any {
    return id;
  }

  addUser(user: any): void {
    this.user = [...this.user, user];
  }

  updateNewUser(user: any): void {
    const index = this.user.findIndex(h => h.id === user.id);
    if (index !== -1) {
      this.user[index] = user;
    }
  }

  deleteService(user: any): void {
    const index: number = this.user.findIndex(h => h.id === user.id);
    if (index !== -1) {
      this.user.splice(index, 1);
    }
  }

  searchService(filter: string): any{
    return this.getAllNewUsers().filter( user => user.name.includes(filter))
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

  updateUser(user: User): Observable<any> {
    return this.http.put(this.usersUrl, user);
  }

}
