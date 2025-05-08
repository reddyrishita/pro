import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminloginService {
  private baseUrl = 'http://localhost:8085/api/admin'; // Updated to use gateway port 8085

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<any> {
    const body = { userName, password };
    console.log('Sending login request:', body); // Add logging
    return this.http.post(`${this.baseUrl}/login`, body)
      .pipe(
        catchError(error => {
          console.error('Login error:', error); // Add logging
          throw error;
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem('admin_token', token);
  }

  setAdminId(id: string): void {
    localStorage.setItem('admin_id', id);
  }
}
