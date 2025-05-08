import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreatetournamentService {
  private apiUrl = 'http://localhost:8085/api/matches'; // Gateway URL

  constructor(private http: HttpClient) { }

  createTournament(tournamentData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const tournament = {
      ...tournamentData,
      userId: userId,
    };
    
    return this.http.post(`${this.apiUrl}/createMatch`, tournament);
  }
}
