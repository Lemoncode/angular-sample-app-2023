import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '@/model/game.model';
import { GameApiService } from '@/services/game-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  id: string;
  gameForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private gameApi: GameApiService,
    private formBuilder: FormBuilder
  ) {
    this.id = '';
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    // Sólo vamos a cubrir la creación
    this.gameForm = this.formBuilder.group({
      name: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      dateRelease: [new Date(), Validators.required],
    });
  }

  handleSaveClick() {
    if (this.gameForm.valid) {
      console.log(this.gameForm.value);
    } else {
      // TODO: esto habría que hacerlo más limpio, usando por ejemplo una notificación de angular material :)
      alert(
        'Formulario inválido, chequea si hay errores de validación en alguno de los campos del formulario'
      );
    }
  }
}
