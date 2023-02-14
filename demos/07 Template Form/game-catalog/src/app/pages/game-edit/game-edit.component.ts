import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '@/model/game.model';
import { GameApiService } from '@/services/game-api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  id: string;
  game: Game;

  constructor(private route: ActivatedRoute, private gameApi: GameApiService) {
    this.game = new Game('');
    this.id = '';
    /*this.route.params.subscribe((params) => {
      this.id = params['id'];
    });*/

    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  handleSaveClick(form: NgForm) {
    if (form.valid) {
      this.gameApi.Insert(this.game);
    } else {
      // TODO: esto habría que hacerlo más limpio, usando por ejemplo una notificación de angular material :)
      alert(
        'Formulario no válido: chequea si hay errores de validación en alguno de los campos del formulario'
      );
    }
  }
}
