import { Component } from '@angular/core';
import { Game } from './model/game.model';
import { Seller } from './model/seller.model';
import { GameApiService } from './services/game-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'game-catalog';
  games: Game[];
  showSellerList: boolean;
  sellers: Seller[];

  constructor(private gameApiService: GameApiService) {
    this.showSellerList = false;
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
