import { Injectable } from '@angular/core';
import { Game } from '../model/game.model';
import { gameMockCollection } from './game-api.mock';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  constructor() {}

  getAll(): Promise<Game[]> {
    return Promise.resolve(gameMockCollection);
  }

  Insert(game: Game): Promise<Game> {
    gameMockCollection.push(game);
    return Promise.resolve(game);
  }
}
