import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizeService {
  private apiUrl1 = 'http://localhost:8085/api/users'; // Gateway URL for organizer
  private apiUrl2 = 'http://localhost:8085/api/matches'; // Gateway URL for matches
  private apiUrl3 = 'http://localhost:8085/api/teams'; // Gateway URL for teams


  constructor(private http: HttpClient) { }

  getOrganizerDetails(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/getOrganizerStats/${userId}`);
  }

  getOrganizerMatches(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}/getMatchByUserId/${userId}`);
  }

  updateOrganizerDetails(organizerDetails: any): Observable<any> {
    return this.http.put(`${this.apiUrl1}/update`, organizerDetails);
  }

  startMatch(matchId: string): Observable<any> {
    return this.http.put(`${this.apiUrl2}/startMatch/${matchId}`, {});
  }

  endMatch(matchId: string): Observable<any> {
    return this.http.put(`${this.apiUrl2}/endMatch/${matchId}`, {});
  }

  // updateMatchStatus(matchId: string, status: string): Observable<any> {
  //   return this.http.put(`${this.apiUrl2}/update-status/${matchId}`, { status });
  // }

  getMatchStats(matchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl3}/matchStats/${matchId}`);
  }
}
