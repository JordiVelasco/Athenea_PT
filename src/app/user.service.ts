import { Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class UserService  {

  private users: any[] = [];

  constructor(private http: HttpClient) { }

  loadUsersFromJson(): Observable<any[]> {
    return this.http.get<any[]>('assets/users.json');
  }

  getAllUsers(): any[] {
    return this.users;
  }
  
  setUsers(users: any[]): void {
    this.users = users;
  }

}
