# Pipes

Las pipes de angular son una forma de transformar datos en la vista, por ejemplo, las podemos usar: para formatear fechas, monedas, etc., o incluso, si estamos depurando, para mostrar por pantalla un objeto de forma más amigable.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- Imaginate que estamos viendo que está pasando con la lista de juegos en la pantalla GameList y queremos mostrar el array que de juegos por pantalla, si probamos a hacer esto:

_./src/app/pages/game-list/game-list.component.html_

```diff
{{ games }}

<div *ngFor="let game of games">
  <app-card-game
    [game]="game"
```

Vemos que por consola sale algo poco util _[object Object],[object Object],[object Object]_

- Vamos ahora a usar un pipe de angular que serializa json a un string, en concreto es el pipe json, que viene incluido en angular.

```diff
- {{ games }}
+ {{ games | json }}


<div *ngFor="let game of games">
  <app-card-game
    [game]="game"
```

Si te fijas, hemos añadido el pipe json al final de la expresión, y ahora vemos que se muestra el array de juegos en formato json.

- Ahora vamos a usar un pipe que nos permite formatear fechas, en concreto vamos a usar el pipe date, que viene incluido en angular, vamos a extraer el año en el que se publico un juego

_./src/app/pages/game-list/card-game/card-game.component.html_

```diff
  <div class="card_title title-white" (click)="onTitleClick()">
-    {{ game.name }} ({{ game.getYearsFromRelease() }})
+    {{ game.name }} ({{ game.dateRelease | date: 'yyyy' }})
  </div>
```

- Ahora vamos a crear un pipe propio, en el que si un juego es anterior al año actual le indicamos que está de oferta, y si es igual al año actual le indicamos que es una novedad.

create a pipe

```bash
ng g pipe pages/game-list/card-game/game-offer.pipe
```

- Vamos a crear un pipe que nos permita mostrar un texto en función de si el juego es una novedad o una oferta.

Y el pipe gameOffer lo vamos a implementar de la siguiente forma:

_./src/app/pages/game-list/card-game/pipes/game-offer.pipe.ts_

```javascript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "gameOffer",
})
export class GameOfferPipe implements PipeTransform {
  transform(year: string): string {
    const currentYear = new Date().getFullYear();
    return value.dateRelease.getFullYear() >= currentYear
      ? "Novedad"
      : "Oferta";
  }
}
```

_./src/app/pages/game-list/card-game/card-game.component.html_

```diff
  <div class="card_title title-white" (click)="onTitleClick()">
-    {{ game.name }} ({{ game.dateRelease | date: 'yyyy' }})
+    {{ game.dateRelease | date: 'yyyy'| gameOffer }}
  </div>
```

Fíjate que aquí hemos encadenado dos pipes, el primero es el pipe date, y el segundo es el pipe gameOffer.

Para ver que esto funciona vamos a cambiar la fecha de publicación de un juego en nuestros datos de mock:

_./src/app/services/game-api.mock.ts_

```diff
import { Game } from '../model/game.model';

export const gameMockCollection = [
  new Game(
    'Super Mario Bros',
-    '13 September 1985',
+    '1 September 2023',

    'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/super-mario.webp',
    [
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
