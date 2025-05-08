import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8085/api/users'; // Gateway URL

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const loginRequest = {
      userName: username,
      password: password
    };
    return this.http.post(`${this.apiUrl}/login`, loginRequest);
  }

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Store userId in localStorage
  setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Clear stored data on logout
  // logout(): void {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('userId');
  //   localStorage.clear();
  // }
}
