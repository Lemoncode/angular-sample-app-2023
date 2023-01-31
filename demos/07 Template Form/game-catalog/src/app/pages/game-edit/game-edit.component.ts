import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '@/model/game.model';
import { GameApiService } from '@/services/game-api.service';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  id: string;
  game: Game;

  constructor(private route: ActivatedRoute, private gameApi: GameApiService) {
    this.id = '';
    this.game = new Game('');
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  handleSaveClick() {
    this.gameApi.Insert(this.game);
  }
}
