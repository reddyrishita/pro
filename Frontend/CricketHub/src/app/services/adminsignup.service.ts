import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminsignupService {
  private baseUrl = 'http://localhost:8085/api/admin'; // Adjust this URL to match your backend API

  constructor(private http: HttpClient) { }

  registerAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createAdmin`, adminData);
  }
}
