# Template Form

Otro punto básico cuando queremos crear una aplicación web es la creación de formularios, en este ejemplo vamos a ver como crear un formulario con un template.

Esta forma es la más fácil de generar un form, pero también la menos óptima, en escenarios complejos puede ser buena idea utilizar React Forms (lo veremos más adelante)

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- En los template forms para enlazar elemento utilizamos la directiva _ngModel_ y el doble binding, también conocido como _banana in a box_ _[()]_ si te fijas es la combinación de los bindings que vimos anteriormente, de esta manera:

- Si un valor del modelo cambia, se actualiza el input.
- Si un valor del input cambia se actualiza el modelo.

Vamos a empezar a usarlo en nuestra página de edición de un juego, vamos a cubrir el caso de creación de un juego.

Lo primero vamos a crear un juego vacio en la página para poder tener un punto de partida:

_./src/app/pages/game-edit/game-edit.component.ts_

```diff
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
+ import { Game } from '@/models/game.model';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  id: string;
+ game: Game;

  constructor(private route: ActivatedRoute) {
    this.id = '';
+   this.game = new Game();
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }
}
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
