import { Injectable } from '@angular/core';
import { Game } from '../model/game.model';
import { gameMockCollection } from './game-api.mock';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:3001/games');
  }

  Insert(game: Game): Observable<Game> {
    // Tendríamos que modificar el mapper para que generara los campos de que pide la API Rest
    return this.http.post<Game>(`./api/games`, {
      name: game.name,
      dateRelease: game.dateRelease.toISOString().substring(0, 10),
      imageUrl: game.imageUrl,
      sellers: [],
    });
  }
}
