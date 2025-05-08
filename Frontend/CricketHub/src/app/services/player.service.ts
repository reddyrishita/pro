import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:8085/api/users'; // Gateway URL for users
  private refreshInterval: any;
  private readonly REFRESH_INTERVAL = 30000; // 30 seconds, adjust as needed
  
  // Add cache and behavior subjects
  private playerCache = new Map<string, any>();
  private currentPlayerSubject = new BehaviorSubject<any>(null);
  currentPlayer$ = this.currentPlayerSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize current player data and start refresh cycle
    this.initializePlayerData();
  }

  private initializePlayerData() {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    const savedData = localStorage.getItem('playerData');
    if (savedData) {
      const playerData = JSON.parse(savedData);
      this.currentPlayerSubject.next(playerData);
    }

    // Initial load
    this.getPlayerDetails().subscribe();

    // Set up periodic refresh
    this.refreshInterval = setInterval(() => {
      this.refreshPlayerData();
    }, this.REFRESH_INTERVAL);
  }

  private updateLocalStorage(player: any) {
    if (player) {
      // Update all relevant player data in localStorage
      
      localStorage.setItem('playerData', JSON.stringify(player));
      
    }
  }

  private refreshPlayerData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get(`${this.apiUrl}/userId/${userId}`).pipe(
        tap(player => {
          this.playerCache.set(userId, player);
          this.currentPlayerSubject.next(player);
          this.updateLocalStorage(player); // Update localStorage with fresh data
        }),
        catchError(error => {
          console.error('Error refreshing player details:', error);
          return of(null);
        })
      ).subscribe();
    }
  }

  // Get player details using stored userId
  getPlayerDetails(): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return of(null);
    }

    return this.http.get(`${this.apiUrl}/userId/${userId}`).pipe(
      tap(player => {
        this.playerCache.set(userId, player);
        this.currentPlayerSubject.next(player);
        this.updateLocalStorage(player); // Update localStorage with fresh data
      }),
      catchError(error => {
        console.error('Error fetching player details:', error);
        return of(null);
      }),
      shareReplay(1)
    );
  }

  // Update player details
  updatePlayerDetails(playerData: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return of(null);
    }
    return this.http.put(`${this.apiUrl}/userId/${userId}`, playerData).pipe(
      tap(updatedPlayer => {
        this.playerCache.set(userId, updatedPlayer);
        this.currentPlayerSubject.next(updatedPlayer);
        this.updateLocalStorage(updatedPlayer); // Update localStorage after update
      })
    );
  }

  // Get all players
  // getAllPlayers(): Observable<any> {
  //   return this.http.get(this.apiUrl);
  // }

  // Get player by specific ID
  getPlayerById(playerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/userId/${playerId}`);
  }

  // Search players by name
  // searchPlayers(searchTerm: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/search?query=${searchTerm}`);
  // }

  // Clean up on logout or component destruction
  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.playerCache.clear();
    this.currentPlayerSubject.next(null);
    // Clear player-related data from localStorage
    localStorage.removeItem('playerData');
    localStorage.removeItem('lastUpdated');
    // Don't remove userId here as it might be needed for other purposes
  }
}
