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
  showSellerList: boolean;
  sellers: Seller[];
  names: string[];

  constructor(private gameApiService: GameApiService) {
    this.showSellerList = false;
    this.sellers = [];
    this.games = [];
    this.names = ['pepe', 'juan', 'maria'];
  }

  handleAddManolo() {
    this.names = [...this.names, 'manolo'];
  }

  loadGames = () => {
    this.gameApiService.getAll().subscribe({
      next: (games) => (this.games = games),
      error: (error) => console.log(error),
    });
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
