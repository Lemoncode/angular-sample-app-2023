import { Component } from '@angular/core';
import { Game } from '../../model/game.model';
import { Seller } from '../../model/seller.model';
import { GameApiService } from '../../services/game-api.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
})
export class GameListComponent {
  games: Game[];
  showSellerList: boolean = false;
  sellers: Seller[];

  constructor(private gameApiService: GameApiService) {
    this.sellers = [];
    this.games = [];
  }

  loadGames = async () => {
    this.games = await this.gameApiService.getAll();
  };

  ngOnInit(): void {
    this.loadGames();
  }

  onShowSellerList(sellers: Seller[]) {
    this.sellers = sellers;
    this.showSellerList = true;
  }

  onCloseSellerList() {
    this.showSellerList = false;
  }
}
