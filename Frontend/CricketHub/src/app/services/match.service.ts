import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:8085/api/matches'; // Gateway URL for matches
  private apiUrl2 = 'http://localhost:8085/api/teams'; // Gateway URL for matches
  private matchesSubject = new BehaviorSubject<any[]>([]);
  matches$ = this.matchesSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getAllMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allMatches`).pipe(
      tap(matches => {
        this.matchesSubject.next(matches);
        localStorage.setItem('matches', JSON.stringify(matches));
      })
    );
  }
  
  getMatchByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/code/${code}`);
  }
  
  getMatchesByLocation(location: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/location/${location}`);
  }
  
  // Get matches by status
  getMatchesByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${status}`);
  }
  
  // Update player stats in a match
  startMatch(matchId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/startMatch/${matchId}`, {});
  }
  
  endMatch(matchId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/endMatch/${matchId}`, {});
  }
  
  matchStats(matchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl2}/matchStats/${matchId}`);
  }
  
  updatePlayerStats(playerStats: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-stats`, playerStats);
  }
  
  
  updateMatchWinner(matchId: string, winner: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-winner/${matchId}`, { winner });
  }
  
  getRegisteredPlayers(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl2}/registeredPlayers/${id}`).pipe(
      tap(teams => {
        console.log('Received registered players:', teams);
      }),
      catchError(error => {
        console.error('Error fetching registered players:', error);
        throw error;
      })
    );
  }

  registerUser(playerData: any): Observable<any> {
    console.log('Sending registration data:', playerData);
    
    // Ensure all required fields are present
    const registrationData = {
        matchId: playerData.matchId,
        userId: playerData.userId,
        userName: playerData.userName,
        teamName: playerData.teamName,
        positions: playerData.positions
    };

    return this.http.post(`${this.apiUrl2}/register`, registrationData)
        .pipe(
            tap(response => console.log('Registration response:', response)),
            catchError(error => {
                console.error('Registration error:', error);
                throw error;
            })
        );
  } 
}
