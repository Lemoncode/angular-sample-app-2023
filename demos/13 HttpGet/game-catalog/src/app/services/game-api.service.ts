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

  Insert(game: Game): Promise<Game> {
    gameMockCollection.push(game);
    return Promise.resolve(game);
  }
}
