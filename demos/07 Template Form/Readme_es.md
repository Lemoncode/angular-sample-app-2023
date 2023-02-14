# Template Form

Otro punto básico cuando queremos desarrollar una aplicación web es la creación de formularios, en este ejemplo vamos a ver como armar un formulario con un template.

Esta forma es la más fácil de generar un form, pero también la menos óptima, en escenarios complejos puede ser buena idea utilizar Reactive Forms (esto lo veremos más adelante)

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- En los template forms para enlazar elementos con datis utilizamos la directiva _ngModel_ y el doble binding, también conocido como _banana in a box_ _[()]_ si te fijas es la combinación de los bindings que vimos anteriormente, de esta manera:

- Si un valor del modelo cambia, se actualiza el input.
- Si un valor del input cambia se actualiza el modelo.

Vamos a empezar a usar esto, en nuestra página de edición de un juego, cubriendo el caso de inserción de un nuevo juego.

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

En el game-edit component, vamos a añadir una variable miembro que almacene un juego en blanco.

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

- Ya que tenemos los datos es hora de enlazarlo con tres inputs en el HTML

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

Fijate que aquí con _ngModel_ estamos enlazando el valor del input con el valor de cada propiedad de la entidad de _game_, por ejeplo _game.name_, _game.image_url_ y _game.daterelease_.

Con los datos enlazados, nos queda añadir un botón de guardado y un handler para el evento _click_ del botón.

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

Vamos a simular que interactuamos con un servicio que se encarga de grabar el juego en un servidor, de momento arrancamos con una implementación mock, y más adelante lo migraremos para que actue contra una API REST.

Ya que queremos trabajar con un array en memoria, pasamos a realizar un pequeño refactor en _gami-api.service_:

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

Pasamos a usar esta varialbe en el servicio, y para simular un insert hacemos un _push_ en el array:

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

En la página de gameEdit reemplazamos el _console.log_ por una llamda al metodo _Insert_ del servicio, para ello lo importamos, nos lo traemos por _dependency injection_,y lo invocamos en el _handleSaveClick_:

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

Esto lo resolveremos más adelante.

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

- En el input añadimos la validación _required_ que nos obliga a rellenar el campo, ésta es estándar de HTML5 pero angular la interpreta, Angular también nos provee de otras directivas de validación como _minlength_, _maxlength_, _email_, _url_, _pattern_, e incluso podemos crear nuestras propias validaciones, además de esto, tenemos que crear una variable en el html (fijate el _#name_ en el tag input) que referencia al _ngModel_, estos nos servirá para poder referenciarlo en el HTML que muestra los resultados de la validación.

- Segundo comprobamos si el campo tiene errores, y si el usuario ha pasado por él o si ha modificado algo, para ello usamos la variable _name_ que tiene el _ngModel_, si la que hemos creado con _#name_, (fijate en los flag _dirty_ o _touched_), es decir mientras no haya pasado por el campo o no haya pulsado en el botón de guardar no mostramos el mensaje de error, así evitamos el patrón odioso de mostrar errores cuando todavía no he podido ni rellenar el formulario.

- Tercero, comprobamos si el campo tiene el error _required_ y mostramos el mensaje de error en ese caso.

Veámoslo en funcionamiento:

```bash
ng serve
```

Vamos ahora a por el campo de la URL, además de validar que el campo esté informado, vamos a asegurarnos de que la URL está bien formada, para ello vamos a usar la directiva _pattern_, que nos permite validar el contenido de un campo contra una expresión regular que hayamos definido.

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

No está de mas, darle un poco de estilado al mensaje de erorr para que aparezca vea en color rojo y en una fuente un poco más pequeña que lo habitual.

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

Vale, esto no está mal, pero si te fijas estamos llenando el html de código, vamos a crear un componente que nos ayude a mostrar los errores, esto de primeras podría parece fácil podemos probar a hacer lo siguiente:

Creamos una carpeta common y creamos nuestro widget para mostrar errores:

```bash
ng g c common/field-error-display
```

Vamos a aceptar como parametro de entrada el NgModel, de momento jugamos sólo con la propiedad _invalid_.

_./common/field-error-display/field-error-display.component.ts_

```ts
import { Component, Input } from "@angular/core";
import { AbstractControlDirective } from "@angular/forms";

@Component({
  selector: "app-field-error-display",
  templateUrl: "./field-error-display.component.html",
  styleUrls: ["./field-error-display.component.css"],
})
export class FieldErrorDisplayComponent {
  @Input() fieldNgModel: AbstractControlDirective | null;

  constructor() {
    this.fieldNgModel = null;
  }
}
```

Aquí aceptamos el ngModel como parametro.

_./common/field-error-display/field-error-display.component.html_

```diff
<p>field-error-display works!</p>
<span>{{ fieldNgModel?.invalid }}</span>
```

Vamos a instanciarlo:

_./pages/game-edit/game-edit.component.html_

```diff
  <input
    type="text"
    id="name"
    name="name"
    [(ngModel)]="game.name"
    required
    #name="ngModel"
  />
  <app-field-error-display [fieldNgModel]="name"></app-field-error-display>
```

Si ahora ejecutamos y jugamos con el control de _name_ vaciandolo y poniendole datos podemos ver que se nos va cambiando la etiqueta de _true_ a _false_ conforme se muestran / eliminan los datos.

Así que vamos a implementar el resto de comportamiento.

_./common/field-error-display/field-error-display.component.css_

```css
.errors > div {
  color: red;
  font-size: 80%;
}
```

_./common/field-error-display/field-error-display.component.html_

```diff
-  <p>field-error-display works!</p>
-  <span>{{ fieldNgModel?.invalid }}</span>

+  <div
+    *ngIf="fieldNgModel?.invalid && (fieldNgModel?.dirty || fieldNgModel?.touched)"
+    class="errors"
+  >
+    <div *ngIf="fieldNgModel?.errors?.['required']">Field is required</div>
+    <div *ngIf="fieldNgModel?.errors?.['pattern']">Format not valid</div>
+  </div>
```

Vamos a sustituir esto en el código:

_./pages/game-edit/game-edit.component.html_

```diff
<div>
  <label for="name">Name</label>
  <input
    type="text"
    id="name"
    name="name"
    [(ngModel)]="game.name"
    required
    #name="ngModel"
  />
+  <app-field-error-display [fieldNgModel]="name"></app-field-error-display>
-  <div *ngIf="name.invalid && (name.dirty || name.touched)" class="errors">
-    <div *ngIf="name.errors?.['required']">Name is required</div>
-  </div>
</div>
<div>
  <label for="imageurl">Picture Url</label>
  <input
    type="text"
    id="imageurl"
    name="imageurl"
    [(ngModel)]="game.imageUrl"
    required
    pattern="https?://.+"
    #imageurl="ngModel"
  />
+  <app-field-error-display [fieldNgModel]="imageurl"></app-field-error-display>
-  <div
-    *ngIf="imageurl.invalid && (imageurl.dirty || imageurl.touched)"
-    class="errors"
-  >
-    <div *ngIf="imageurl.errors?.['required']">Image URL is required</div>
-    <div *ngIf="imageurl.errors?.['pattern']">Image URL is not valid</div>
-  </div>
</div>

```

Y oye ¿Genial? NO, si te pones a mirar caso arista verás que para que estuviera en produccíon tendríamos que tener en cuenta casuistica que nos haría complicado sacar un componente genérico:

- Primero, tenemos que meter todos lo validadores en ese componente o un array (no te olvides de añadirlos...) si no, no se mostraría el mensaje de error, otra opción es informar esas validaciones en un array, pero entonces tendríamos que definirlas dos veces, en el componente y en la validación.

- Segundo, lo normal es que cuando una validación falla, cortocircuitemos el resto (lo normal es que sólo queramos mostrar un mensaje de error, es una tontería que is un campo no está informado, encima le digamos no es un email bien formado, emborrachamos al usuario de información), otra opción sería iterar por las propiedades de _errors_ (como si fuera un array), pero aquí el orden de validación no lo conocemos.

- Tercero para las validaciones de tipo patrón, no vale con decir Patrón no valido, si no "NIF no valido", o "Email no valido"

Más información acerca de validadores y como hacer un implementar un widget para mostrar errores:

https://angular.io/guide/form-validation

https://medium.com/swlh/creating-a-reusable-component-for-display-validation-errors-in-angular-forms-fdfba4ac1ad1

Vamos a por el último punto, los mensajes de error se muestran, peeerooo resulta que yo puedo seguir pulsando sobre el bóton de grabar !, vamos a resolver esto de dos maneras y ver los pros y cons de cada una:

- Primera opción, deshabilitar el botón de grabar si hay errores, para ello:

- Para obtener la información global del formulario vamos a añadir un atributo al formulario:

_./pages/game-edit/game-edit.component.html_

```diff
+ <form #gameForm="ngForm">
<div>
  <label for="name">Name</label>
  <input
    type="text"
    id="name"
    name="name"
    [(ngModel)]="game.name"
    required
    #name="ngModel"
  />
  <app-field-error-display [fieldNgModel]="name"></app-field-error-display>
</div>
// (...)
  <button (click)="handleSaveClick()">Save</button>
+ </form>
```

- Vamos a añadir un atributo al botón de grabar:

_./pages/game-edit/game-edit.component.html_

```diff
- <button (click)="handleSaveClick()">Save</button>
+ <button
+   (click)="handleSaveClick()"
+   [disabled]="gameForm?.invalid"
+ >
+   Save
+ </button>
```

¿Qué estamos haciendo aquí? Por un lado la información del formulario la guardamos en una variable _#gameForm_ y después en el atributo del botón de save comprobamos si está a true o no el campo _invalid_ para deshabilitar el botón.

Esto parece estar muy bien, pero puede presentarte un problema serio de usabilidad (UX), el usuario no sabe por qué no puede pulsar el botón de grabar, si no le indicamos el motivo, no sabrá que hacer, así que lo mejor es dejarle al usuario que pulse en el botón de grabar y mostrarle un mensaje de error con las indicaciones para resolverlo.

Para hacer esto lo que hacemos es pasarle al handler _handleSaveClick_ como parametro la variable del formulario (la que creamos con _#gameForm_).

_./pages/game-edit/game-edit.component.html_

```diff
  <button
-    (click)="handleSaveClick()"
+    (click)="handleSaveClick(gameForm)"
-    [disabled]="gameForm?.invalid"
    >
```

_./pages/game-edit/game-edit.component.ts_

```diff
-  handleSaveClick() {
+  handleSaveClick(form: NgForm) {
+    if (form.valid) {
      this.gameApi.Insert(this.game);
+    } else {
+      // TODO: esto habría que hacerlo más limpio, usando por ejemplo una notificación de angular material :)
+      alert(
+        'Formulario inválido, chequea si hay errores de validación en alguno de los campos del formulario'
+      );
+    }
  }
```

También puedes crear validadores custom:

https://www.tektutorialshub.com/angular/custom-validator-in-template-driven-forms-in-angular/

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

```

```
