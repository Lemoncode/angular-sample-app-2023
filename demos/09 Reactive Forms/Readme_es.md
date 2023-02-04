# Reactive Forms

Hemos visto como trabajar con formularios de plantilla en Angular con su _ngModel_, todo muy bonito y muy fácil, hasta que quieres hacer algo más allá de un formulario de login o la típica demo con el _happy path_, problemas que tienen:

- Manchamos el HTML con validaciones, es decir metemos en UI lógica de negocio.
- El _ngModel_ me imponen restricciones, todo el proceso de actualización es mágico y sin poder internvenir de manera fácil, por ejemplo, gestionar un input de tipo date y enlazarlo a un campo fecha es algo que no va muy bien.
- Si además queremos crear un componente custom que soporte _ngModel_ tenemos que implementar la interfaz _ControlValueAccessor_ y no es algo directo.

Vamos a ver como podemos resolver estos problemas con _Reactive Forms_, una aproximación que se basa en código para definir la gestión de un formulario y que nos permite tener un control más fino de lo que se está haciendo en el formulario.

¿Qué meda un formulario Reactivo sobre uno de plantilla?

- Una acceso seguro al modelo de datos.
- Una forma de hacer tracking del modelo de datos de una forma más predecible.
- Una serie de operadores que me permiten trabaja con inmutabilidad de datos.

Los pasos que vamos a seguir son:

1. En el TS del componente de crear juego,definir el formulario reactivo.
2. Cambiamos el HTML y volvemos a componentes básicos (sin NgModel)
3. Reutilizamos las validaciones
4. Arreglamos el problema de la fecha
5. Adaptamos nuestro componente genérico para que utilice Reactive Forms

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

Vamos refactorizar el componente de crear juego para reemplazar el formulario de plantilla por uno reactivo.

- Lo primero en el modulo principal tenemos que decirle que vamos a usar _ReactiveFormsModule_.

_./src/app/app.module.ts_

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
+ import { ReactiveFormsModule } from '@angular/forms';
```

_./src/app/app.module.ts_

```diff
  imports: [BrowserModule,
            RouterModule.forRoot(appRoutes),
            FormsModule,
+           ReactiveFormsModule
            ],
  providers: [],
  bootstrap: [AppComponent],
})
```

Ahora nos vamos a código y vamos a definir los campos del formulario, para ello contamos con:

- FormGroup: Es el contenedor de todos los campos del formulario.
- FormControl: Es el campo en sí, es decir, el input.
- Validators: Es un conjunto de validaciones que podemos aplicar a un campo (aquí distinguimos entre dos tipos de validadores, los sincronos y los asincronos).

Para ayudarnos con todo este galimatías, Angular nos ofrece un _builder_ que nos permite crear el formulario de manera más sencilla.

Vamos a definir el formulario de creación de juegos:

_./src/app/games/components/game-edit/game-edit.component.ts_

```diff
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '@/model/game.model';
import { GameApiService } from '@/services/game-api.service';
- import { NgForm } from '@angular/forms';
+ import { FormGroup, FormBuilder, Validators } from '@angular/forms'
```

```diff
export class GameEditComponent {
  id: string;
-  game: Game;
+  gameForm: FormGroup;

-  constructor(private route: ActivatedRoute, private gameApi: GameApiService) {
+  constructor(private route: ActivatedRoute, private gameApi: GameApiService, private formBuilder: FormBuilder) {

    this.id = '';
-    this.game = new Game('');
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

+    // Sólo vamos a cubrir la creación
+    this.gameForm = this.formBuilder.group({
+      name: ['', Validators.required],
+      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
+      dateRelease: [new Date(), Validators.required],
+    });
  }
```

- Y en el handleSave vamos a añadir un _console.log_ para ver el contenido del formulario:

_./src/app/games/components/game-edit/game-edit.component.ts_

```diff
-  handleSaveClick(form: NgForm) {
+  handleSaveClick() {

-    if (form.valid) {
+    if (this.gameForm.valid) {
+      console.log(this.gameForm.value);
-      this.gameApi.Insert(this.game);
    } else {
      // TODO: esto habría que hacerlo más limpio, usando por ejemplo una notificación de angular material :)
      alert(
        'Formulario inválido, chequea si hay errores de validación en alguno de los campos del formulario'
      );
    }
  }
```

- Fíjate que hacemos aquí:
  - Utilizamos formBuilder para crear el formulario.
  - Definimos un grupo (nuestro modelo es sencillo).
  - Definimos los campos del formulario, en este caso, name, imageUrl y dateRelease, cada campo tiene como valor un array, el primero es el valor que le asignamos, el segundo las validaciones síncronas que queremos aplicar, y el tercero las validaciones asíncronas (no las usamos en este caso).

> Un tema importante a partir de Angular 14 es buena idea definir la estructura de este formulario en el constructor para tener un tipado fuerte, si la definimos en el _onInit_ no tendremos tipado, [más información sobre strictly typed forms en este enlace](https://blog.angular-university.io/angular-typed-forms/).

Ahora nos vamos a la vista, y en vez de enlazar los controles con _NgModel_, lo vamos a hacer con _formControlName_.

_./src/app/games/components/game-edit/game-edit.component.html_

```diff
-  <form #gameForm="ngForm" class="form">
+  <form [formGroup]="gameForm" class="form">

    <app-input-wrapper
      id="name"
      name="name"
      label="Name"
-      [(ngModel)]="game.name"
+      [formControlName]="name"
-      required
    ></app-input-wrapper>

    <app-input-wrapper
      id="imageurl"
      name="imageurl"
      label="Picture Url"
-      [(ngModel)]="game.imageUrl"
+      [formControlName]="imageUrl"
-      required
-      pattern="https?://.+"
    ></app-input-wrapper>

    <app-input-wrapper
      id="daterelease"
      name="daterelease"
      label="Release Date"
-      [(ngModel)]="game.dateRelease"
+      [formControlName]="dateRelease"
    ></app-input-wrapper>

-    <button (click)="handleSaveClick(gameForm)">Save</button>
+    <button (click)="handleSaveClick()">Save</button>
```

- Vamos a probar

```bash
ng serve
```

- Fíjate que todo funciona correctamente pero... ¡ estamos usando un custom component ¿Cómo puede ser eso? ¿Como entiende el _formControlName_? Porque anteriormente implementamos la interfaz _ControlValueAccessor_ y esto también aplica a los Reactive forms.

Vamos ahora a arreglar el problema que teníamos con el _dateRelease_, si te acuerdas teníamos un campo de tipo date y el input espera un texto, que vamos a hacer:

- Primero hacer que nuestro custom input acepte al atributo _type_.
- Segundo vamos a definir un modelo de la vista (un ViewModel) aquí lo que hacemos es crear una entidad que cumpla exactamente con lo que espera la vista.
- Vamos a crear un mapper, esta función se encarga de convertir de un modelo a otro, en este caso de un modelo de api a un modelo de vista.
- A la hora de grabar convertiremos de modelo de vista a modelo de api.

- Primero vamos a por el _type_, que por defecto es _text_, pero vamos a permitir que se pueda cambiar.:

_./src/app/games/input-wrapper/input-wrapper.component.ts_

```diff
export class InputWrapperComponent implements ControlValueAccessor {
  @Input() label: string;
+ @Input() type: string;
  name: string;
  fieldValue: string;
  _formControl!: FormControl;

  constructor(@Inject(INJECTOR) private injector: Injector) {
    this.label = '';
+   this.type = 'text';
    this.fieldValue = '';
    this.name = '';
  }
```

Y en el html:

_./src/app/games/input-wrapper/input-wrapper.component.html_

```diff
  <input
    name="label"
-    type="text"
+   [type]="type"
    [ngModel]="value"
    (ngModelChange)="onChange($event)"
    (blur)="onTouch()"
  />
```

- Volvemos al formulario y ponemos ese campo como date:

_./src/app/games/components/game-edit/game-edit.component.html_

```diff
    <app-input-wrapper
      id="daterelease"
      name="daterelease"
      label="Release Date"
+     type="date"
      formControlName="dateRelease"
    ></app-input-wrapper>
```

Si ejecutamos podemos ver que tenemos ahora el control de fecha (no es muy bonito pero es funcional), mi consejo aquí es usar una librería como Angular Material.

Si probamos a ejecutar, podemos ver que si rellenamos todos los campos y ponemos una fecha al grabar aparece por consola la fecha, peeerooo:

- El valor inicial estaba en blanco.
- El valor que se muestra por consola es un texto, no es un date.

Vamos ahora a por el modelo de la vista y los mappers.

- Creamos el modelo de la vista:

_./src/app/games/game-edit/game.vm.ts_

```ts
export interface GameVm {
  name: string;
  imageUrl: string;
  dateRelease: string;
}
```

- Vamos a crear un mapper en ambos sentidos (en este caso, como no tiene estado, vamos usar vanilla JavaSript, otra opción sería crearlo como un servicio y registrarlo en el módulo):

_./src/app/games/game-edit/game.mapper.ts_

```ts
import { Game } from "@/model/game.model";
import { GameVm } from "./game.vm";

export const mapGameToVm = (game: Game): GameVm => ({
  name: game.name,
  imageUrl: game.imageUrl ?? "",
  dateRelease: game.dateRelease.toISOString().substring(0, 10),
});

export const mapVmToGame = (gameVm: GameVm): Game =>
  new Game(gameVm.name, gameVm.dateRelease, gameVm.imageUrl);
```

Y ahora vamos a usarlos en el componente:

_./src/app/games/components/game-edit/game-edit.component.ts_

```diff
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '@/model/game.model';
import { GameApiService } from '@/services/game-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
+ import { mapGameToVm, mapVmToGame } from './game.mapper';
```

```diff
  constructor(
    private route: ActivatedRoute,
    private gameApi: GameApiService,
    private formBuilder: FormBuilder
  ) {
    this.id = '';
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

+    // De este mapper podríamos haber pasado pero así nos valdría también para editar un juego
+    const gameVm = mapGameToVm(new Game('', new Date().toISOString().substring(0, 10), ''));

    // Sólo vamos a cubrir la creación
    this.gameForm = this.formBuilder.group({
-      name: ['', Validators.required],
-      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
-      dateRelease: [new Date(), Validators.required],
+      name: [gameVm.name, Validators.required],
+      imageUrl: [gameVm.imageUrl , [Validators.required, Validators.pattern('https?://.+')]],
+      dateRelease: [gameVm.dateRelease, Validators.required],
    });
  }
```

```diff
  handleSaveClick() {
    if (this.gameForm.valid) {
      console.log(this.gameForm.value);
+     const game = mapVmToGame(this.gameForm.value);
+     this.gameApi.Insert(game);
    } else {
      // TODO: esto habría que hacerlo más limpio, usando por ejemplo una notificación de angular material :)
      alert(
        'Formulario inválido, chequea si hay errores de validación en alguno de los campos del formulario'
      );
    }
  }
```

- Y en el input-wrapper, vamos a meter un pequeño cambio para que acepte los valores iniciales:

_./src/app/shared/components/input-wrapper/input-wrapper.component.ts_

```diff
  ngAfterViewInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null);
    if (ngControl) {
+      this.fieldValue = ngControl.value;
      setTimeout(() => {
        this._formControl = ngControl.control as FormControl;
      });
    }
  }
```

Y en el HTML:

_./src/app/shared/components/input-wrapper/input-wrapper.component.html_

```diff
  <input
    name="label"
    [type]="type"
-    [ngModel]="fieldValue"
+    [ngModel]="fieldValue"
    (ngModelChange)="onChange($event)"
    (blur)="onTouch()"
  />
```

- Ahora podemos insertar un juego y ver que aparece en la lista (incluida la fecha !!)

# Referencias

Tutorial Reactive Forms

https://www.tektutorialshub.com/angular/angular-reactive-forms/

https://www.knowledgehut.com/blog/web-development/reactive-forms-in-angular

https://blog.angular-university.io/angular-typed-forms/

Guía oficial Angular

https://angular.io/guide/reactive-forms

Custom form controls

https://blog.angular-university.io/angular-custom-form-controls/

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
