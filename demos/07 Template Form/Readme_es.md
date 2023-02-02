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

Antes de usar _ngModel_ tenemos que importarnos el _FormsModule_ en el módulo principal de la aplicación.

_./src/app/app.module.ts_

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
+ import { FormsModule } from '@angular/forms';
```

```diff
@NgModule({
  declarations: [
    AppComponent,
    CardGameComponent,
    SellerListComponent,
    GameListComponent,
    GameEditComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
+   FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent],
})
```

Lo primero vamos a crear un juego vacio en la página para poder tener un punto de partida:

_./src/app/pages/game-edit/game-edit.component.ts_

```diff
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
+ import { Game } from '@/model/game.model';

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
+   this.game = new Game("");
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }
}
```

- Vamos ahora a enlazar estos datos con tres _inputs_ en la parte del _html_

_./src/app/pages/game-edit/game-edit.component.html_

```diff
- <p>game-edit works!</p>
- <p>Id: {{ id }}</p>
+ <div>
+   <label for="name">Name</label>
+   <input type="text" id="name" name="name" [(ngModel)]="game.name" />
+ </div>
+ <div>
+   <label for="imageurl">Picture Url</label>
+   <input type="text" id="imageurl" name="imageurl" [(ngModel)]="game.imageUrl" />
+ </div>
+ <div>
+   <label for="daterelease">Release Date</label>
+   <input type="date" id="daterelease" name="daterelease" [(ngModel)]="game.dateRelease" />
+ </div>
```

Fijate que aquí con _ngModel_ estamos enlazando el valor del input con el valor de la propiedad _name_ del modelo _game_ y así con el resto de propiedades.

De hecho vamos añadir un botón de guardado y un handler para el evento _click_ del botón.

_./src/app/pages/game-edit/game-edit.component.ts_

```diff
  constructor(private route: ActivatedRoute) {
    this.id = '';
    this.game = new Game('');
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

+  handleSaveClick() {
+    console.log(this.game);
+  }
}
```

_./src/app/pages/game-edit/game-edit.component.html_

```diff
<div>
  <label for="description">Release Date</label>
  <input
    type="text"
    id="description"
    name="description"
    [(ngModel)]="game.dateRelease"
  />
</div>
+ <button (click)="handleSaveClick()">Save</button>
```

Si ahora probamos, podemos ver como al pulsar en el botón se imprime por consola el juego que hemos creado.

Vamos a conectar ahora con el servicio de juegos para poder guardar el juego, esto será una implementacíon mock pero más adelante no permitirá guardar el juego en el servidor.

Vamos a hacer un pequeño refactor en _gami-api.service_ para poder trabajar en memoria mientras esperamos a que el server este listo:

Primero la lista de juegos la vamos a poner en una variable en un fichero aparte:

_./services/game-api.mock.ts_

```ts
import { Game } from "../model/game.model";

export const gameMockCollection = [
  new Game(
    "Super Mario Bros",
    "13 September 1985",
    "https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/super-mario.webp",
    [
      {
        id: 1,
        name: "Old shop",
        price: 95,
        amount: 2,
        isAvailable: true,
      },
      {
        id: 2,
        name: "New shop",
        price: 115,
        amount: 1,
        isAvailable: true,
      },
      {
        id: 3,
        name: "Regular shop",
        price: 135,
        amount: 0,
        isAvailable: false,
      },
    ]
  ),
  new Game(
    "Legend of Zelda",
    "21 February 1986",
    "https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/legend-zelda.webp",
    [
      {
        id: 3,
        name: "Old shop",
        price: 125,
        amount: 0,
        isAvailable: false,
      },
      {
        id: 4,
        name: "New shop",
        price: 145,
        amount: 1,
        isAvailable: true,
      },
    ]
  ),
  new Game(
    "Sonic",
    "26 June 1981",
    "https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/sonic-frontiers.webp",
    []
  ),
];
```

_./services/game-api.service.ts_

```diff
import { Injectable } from '@angular/core';
import { Game } from '../model/game.model';
+ import { gameMockCollection } from './game-api.mock';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  constructor() {}

  getAll(): Promise<Game[]> {
    return Promise.resolve(
+      gameMockCollection
-      [
-      new Game(
-        'Super Mario Bros',
-        '13 September 1985',
-        'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/super-mario.webp',
-        [
-          {
-            id: 1,
-            name: 'Old shop',
-            price: 95,
-            amount: 2,
-            isAvailable: true,
-          },
-          {
-            id: 2,
-            name: 'New shop',
-            price: 115,
-            amount: 1,
-            isAvailable: true,
-          },
-          {
-            id: 3,
-            name: 'Regular shop',
-            price: 135,
-            amount: 0,
-            isAvailable: false,
-          },
-        ]
-      ),
-      new Game(
-        'Legend of Zelda',
-        '21 February 1986',
-        'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/legend-zelda.webp',
-        [
-          {
-            id: 3,
-            name: 'Old shop',
-            price: 125,
-            amount: 0,
-            isAvailable: false,
-          },
-          {
-            id: 4,
-            name: 'New shop',
-            price: 145,
-            amount: 1,
-            isAvailable: true,
-          },
-        ]
-      ),
-      new Game(
-        'Sonic',
-        '26 June 1981',
-        'https://raw.githubusercontent.com/Lemoncode/angular-sample-app/master/media/sonic-frontiers.webp',
-        []
-      ),
-    ]);
+    );
  }

+  Insert(game: Game): Promise<Game> {
+    gameMockCollection.push(game);
+    return Promise.resolve(game);
+  }
}
```

Y en la página vamos a llamar al metodo _Insert_ del servicio, para ello lo importamos, nos lo traemos por _dependency injection_,y lo invocamos en el _handleSaveClick_:

_./pages/game-edit/game-edit.component.ts_

```diff
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '@/model/game.model';
+ import { GameApiService } from '@/services/game-api.service';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  id: string;
  game: Game;

-  constructor(private route: ActivatedRoute) {
+  constructor(private route: ActivatedRoute, private gameApi: GameApiService) {

    this.id = '';
    this.game = new Game('');
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  handleSaveClick() {
-    console.log(this.game);
+    // TODO tendríamos que chequear si estamos en inserción o edición
+    this.gameApi.Insert(this.game);
  }
}
```

- Vamos a probarlo, introduce estos datos:

Nombre: Streets of rage 4
Url imagen: https://raw.githubusercontent.com/Lemoncode/angular-sample-app-2023/main/media/streetsofrage4.jpeg
Fecha de lanzamiento: 02/02/2021

- Si volvemos a la página de listado, veremos que se ha añadido el juego, PEEEEROOOOO,
  fijate que el título no se ve esto es porque el campo fecha se ha grabado como texto, aquí nos encontramos con un caso que se nos complica, ¿Qué podríamos hacer?

- Usar un control de angular material y que directamente trabajemos con fechas.
- Hacer un mapeador de fechas, que nos permita convertir el texto a fecha y viceversa, y usarlo
  manualmente antes de guardar.
- Arreglarlo a más bajo nivel utilizando creando un directiva que haga el cambio

https://coryrylan.com/blog/using-html5-date-input-with-date-objects-and-angular

Esto lo dejaremos para cuando cubramos las directivas.

- Vamos a continuar completando la parte estándar de nuestro formulario.
  - Completamos el formulario añadiendo validación.
  - Vemos la forma de simplificar la validación.
  - Añadimos algo de diseño.
  - Crearemos un component custom que gestione el ngModel.

Vamos a partir por añadir las siguientes validaciones a nuestro formulario:

- El campo nombre es obligatorio.
- El campo Picture URL es obligatorio y debe ser una URL válida.

Para ello podemos usar la directiva _required_ y _pattern_.

_./pages/game-edit/game-edit.component.ts_

```diff
<div>
  <label for="name">Name</label>
-  <input type="text" id="name" name="name" [(ngModel)]="game.name" />
+ <input type="text" id="name" name="name" [(ngModel)]="game.name" required #name="ngModel"/>
+  <div *ngIf="name.invalid && (name.dirty || name.touched)">
+    <div *ngIf="name.errors?.['required']">Name is required</div>
+  </div>
</div>
```

¿Qué estamos haciendo aquí?

- En el input añadimos la validación _required_ que nos obliga a rellenar el campo, esta es estandar de HTML5 pero angular la interpreta, Angular también nos provee de otras directivas de validación como _minlength_, _maxlength_, _email_, _url_, _pattern_, y también podemos crear nuestras propias validaciones, además de esto tenemos que crear una variable global (fijate el _#name_) que referencia al _ngModel_ .

- Segundo comprobamos si el campo tiene errors, y si el usuario ha pasado por el o si ha modificado algo (dirty o touched), es decir mientras no haya pasado por el campo o no
  hay pulsado en el botón de guardar no mostramos el mensaje de error, así evitamos el patrón
  odioso de mostrar errores cuando todavía no he podido ni rellenar el formulario, ojo para esto usamos la variable que hemos creado previamente en el tag input que se llame _#name_

- Tercero, comprobamos si el campo tiene el error _required_ y mostramos el mensaje de error en
  ese caso.

Veámoslo en funcionamiento:

```bash
ng serve
```

Vamos ahora a por el campo de la URL, para ello vamos a usar la directiva _pattern_.

_./pages/game-edit/game-edit.component.ts_

```diff
  <label for="imageurl">Picture Url</label>
  <input
    type="text"
    id="imageurl"
    name="imageurl"
    [(ngModel)]="game.imageUrl"
+   required
+   pattern="https?://.+"
+   #imageurl="ngModel"
  />
+  <div *ngIf="imageurl.invalid && (imageurl.dirty || imageurl.touched)">
+    <div *ngIf="imageurl.errors?.['required']">Image URL is required</div>
+    <div *ngIf="imageurl.errors?.['pattern']">Image URL is not valid</div>
+  </div>
</div>
```

Vamos darle un poco de estilado a esto para que sea vea el mensaje de error en rojo.

_./pages/game-edit/game-edit.component.css_

```css
.errors > div {
  color: red;
  font-size: 80%;
}
```

Vamos a actualizar los div que muestran los errores.

_./pages/game-edit/game-edit.component.html_

```diff
    #name="ngModel"
  />
-  <div *ngIf="name.invalid && (name.dirty || name.touched)">
+ <div *ngIf="name.invalid && (name.dirty || name.touched)" class="errors">
    <div *ngIf="name.errors?.['required']">Name is required</div>
  </div>
</div>
```

```diff
    #imageurl="ngModel"
  />
-   <div *ngIf="imageurl.invalid && (imageurl.dirty || imageurl.touched)">
+   <div *ngIf="imageurl.invalid && (imageurl.dirty || imageurl.touched)" class="errors">
    <div *ngIf="imageurl.errors?.['required']">Image URL is required</div>
    <div *ngIf="imageurl.errors?.['pattern']">Image URL is not valid</div>
  </div>
```

https://angular.io/guide/form-validation

https://medium.com/swlh/creating-a-reusable-component-for-display-validation-errors-in-angular-forms-fdfba4ac1ad1

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)

```

```

```

```
