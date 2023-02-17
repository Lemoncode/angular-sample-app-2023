# Reactive Forms

Hemos visto como trabajar con formularios de plantilla en Angular con su _ngModel_, todo muy bonito y muy fácil, hasta que quieres hacer algo más allá de un formulario de login o la típica demo con el _happy path_, si tienes que hacer algo más complejo, lo ideal es que uses _Reactive Forms_.

Diferencias entre Template forms y Reactive forms:

1. **Sintaxis:** Los Template-driven Forms utilizan una sintaxis declarativa y se basan en directivas estructurales como ngModel, ngForm, ngSubmit, etc. mientras que los Reactive Forms utilizan una sintaxis programática y se basan en clases de TypeScript.

2. **Validación:** La validación en Template-driven Forms se realiza mediante directivas como ngModel y ngForm, mientras que en Reactive Forms, la validación se realiza mediante funciones de validación que se pueden definir en la clase del formulario.

3. **Control sobre los datos:** Los Reactive Forms ofrecen un mayor control sobre los datos que se envían y reciben desde el formulario. Por ejemplo, los Reactive Forms permiten establecer valores predeterminados y realizar validaciones más complejas.

4. **Pruebas:** Los Reactive Forms son más fáciles de probar porque se basan en clases TypeScript que se pueden instanciar y manipular directamente en las pruebas, mientras que los Template-driven Forms pueden ser más complicados de probar debido a la dependencia de las directivas del template.

5. **Rendimiento:** Los Reactive Forms son más eficientes en términos de rendimiento, especialmente en formularios más complejos, porque ofrecen más control sobre cuándo y cómo se actualizan los datos del formulario.

En general, los Reactive Forms son una opción más flexible y potente, especialmente en aplicaciones grandes y complejas, mientras que los Template-driven Forms pueden ser más fáciles de implementar y entender para formularios más simples y pequeños.

Los pasos que vamos a seguir son:

1. En el TS del componente de crear juego, definimos el formulario reactivo.
2. Definimos sus validaciones.
3. Actualizamos el HTML
4. Arreglaremos el problema del _date picker_.

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

Ahora nos vamos a código y definimos los campos del formulario, para ello contamos con:

- **FormGroup:** Es el contenedor de todos los campos del formulario.
- **FormControl:** Es el campo en sí, es decir, el valor que se asocia a un input.
- **Validators:** Es un conjunto de validaciones que podemos aplicar a un campo (aquí distinguimos entre dos tipos de validadores, los síncronos y los asíncronos).

Para ayudarnos con todo este galimatías, Angular nos ofrece un _builder_ que nos permite crear el formulario de manera más sencilla.

Es hora de definir el formulario de creación de juegos:

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
  - Definimos los campos del formulario, en este caso, name, imageUrl y dateRelease, cada campo tiene como valor un array: el primero es el valor que le asignamos, el segundo las validaciones síncronas que queremos aplicar, y el tercero las validaciones asíncronas (no las usamos en este caso).

> Un tema importante, a partir de Angular 14 es buena idea definir la estructura de este formulario en el constructor para tener un tipado fuerte, si la definimos en el _onInit_ no tendremos tipado, [más información sobre strictly typed forms en este enlace](https://blog.angular-university.io/angular-typed-forms/).

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
+      formControlName="name"
-      required
    ></app-input-wrapper>

    <app-input-wrapper
      id="imageurl"
      name="imageurl"
      label="Picture Url"
-      [(ngModel)]="game.imageUrl"
+      formControlName="imageUrl"
-      required
-      pattern="https?://.+"
    ></app-input-wrapper>

    <app-input-wrapper
      id="daterelease"
      name="daterelease"
      label="Release Date"
-      [(ngModel)]="game.dateRelease"
+      formControlName="dateRelease"
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

- Vamos a definir un modelo de la vista (un ViewModel) aquí lo que hacemos es crear una entidad que cumpla exactamente con lo que espera la vista.
- Vamos a crear un mapper, esta función se encarga de convertir de un modelo a otro, en este caso de un modelo de api a un modelo de vista.
- A la hora de grabar convertiremos de modelo de vista a modelo de api.

Ahora mismo lo que nos pasa es que:

- El valor inicial esta en blanco.
- El valor que se muestra por consola es un texto, no es un date.

Es hora de que nos pongamos a trabajar con viewmodels y mapeadores:

- Un viewModel es una entidad que cumple exactamente con lo que espera la vista, así es muy fácil poder desarrollar este componente.
- Un mapper es una función que se encarga de convertir de modelo de api a modelo de vista y viceversa.

De esta manera tenemos piezas que hacen una cosa y sólo una cosa, que son fáciles de testear por separado y que hacen que el resto de componentes sean más fáciles de desarrollar.

- Creamos el modelo de la vista:

_./src/app/games/game-edit/game.vm.ts_

```ts
export interface GameVm {
  name: string;
  imageUrl: string;
  dateRelease: string;
}
```

- Vamos a crear un mapper en ambos sentidos (en este caso, como este mapper no tiene estado, vamos usar vanilla JavaScript, otra opción sería crearlo como un servicio y registrarlo en el módulo):

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

+    // Establecemos valores iniciales, podríamos usar algo así para el edit también
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

Y en el save lo aplicamos en el otro sentido

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
-    [ngModel]="value"
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
