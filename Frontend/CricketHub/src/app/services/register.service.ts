import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8085/api/users';

  constructor(private http: HttpClient) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUser`, userData);
  }

  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/${email}`);
  }

  checkUsernameExists(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/userName/${username}`);
  }
}
