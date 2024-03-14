import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game } from './models/game.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'game-catalog';
  private games: Game[];
  game: Game = new Game('');

  constructor() {
    this.games = [
      new Game('Super Mario Bros', '13 September 1985'),
      new Game('Legend of Zelda', '21 February 1986'),
      new Game('Sonic', '26 June 1981'),
    ];
    console.log('** Constructor called **');
  }
  ngOnInit() {
    console.log('** ngOnInit called **');
    this.game = this.games[0];
  }
}
