# ngModel Custom Component

Ya tenemos nuestro formulario montado, pero tiene una pinta un poco cutre, vamos a darle un poco de estilo y vamos a intentar no repetir código y mantener un estilado coherente.

Para ello en un primer paso:

- Vamos a crear un componente que haga de wrapper de un input, con un estilado cuidado.
- Vamos a incluir en ese componente el componente que muestra errores.

De esta manera la página de creación de juegos se simplifica.

Una vez que tengamos esto podemos maquetar la página en si para que tenga mejor aspecto.

# Paso a paso

El formulario de creación de juegos funciona, pero tiene una pinta un poco fea, vamos a darle un poco de estilado, la idea es que los inputs:

- Tengan una etiqueta pequeña en la parte superior izquierda que indique el nombre del campo.
- Tengan un borde redondeado.
- Muestren los errores en la parte inferior del input.

Para evitar tener que repetir código vamos a crear un componente que haga de wrapper de un input, con un estilado cuidado, y que incluya el componente que muestra los errores.

Vamos a empezar por crear el componente wrapper, preocupándonos sólo de la maquetación:

Para ello vamos a llamar al componente _input-wrapper_.

```bash
ng g c common/input-wrapper
```

Vamos a por la parte visual:

_./src/app/components/input-wrapper/input-wrapper.component.html_

```css
.wrapper {
  position: relative;
  margin-bottom: 20px;
}

label {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 12px;
  color: #999;
  transition: all 0.2s ease-in-out;
}

input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

input:focus {
  border-color: #666;
}
```

De momento añadimos en el componente el nombre de la etiqueta:

_./src/app/components/input-wrapper/input-wrapper.component.ts_

```diff
- import { Component } from '@angular/core';
+ import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.css']
})
export class InputWrapperComponent {
+ @Input() label: string;

+ constructor() {
+  this.label = '';
+ }
}
```

_./src/app/components/input-wrapper/input-wrapper.component.html_

```diff
- <p>input-wrapper works!</p>
+ <div class="wrapper">
+  <label>{{ label }}</label>
+  <input type="text" />
+ </div>
```

> De momento no ponemos la info de errores, ya añadiremos el componente que muestra los errores.

Vamos a instanciar este componente en el formulario de creación de juegos:

_./src/app/components/game-edit/game-edit.component.html_

```diff
+ <app-input-wrapper label="Name"></app-input-wrapper>
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
```

Bien tenemos un componente mejor aspecto (queda pendiente envolverlo en un contenedor que no tenga un ancho fijo, pero ese ajuste lo haremos más adelante), vamos ahora al turrón, nos hace falta tirar de ngModel ¿Qué pasa aquí?

- El componente _input-wrapper_ no tiene ngModel, por lo que no podemos usarlo directamente.
- Tenemos que implementar la fontanería necesaria para que el componente _input-wrapper_ pueda ser usado como ngModel, y después usarlo intermanente en el componente _input-wrapper_.

Aquí es donde todo el azúcar que habíamos ganado utilizando _ng-model_ se esfuma, agarrate que vienen curvas: Tenemos que implementar la interfaz _ControlValueAccessor_.

Vamos a decirle a nuestro componente que herede de _ControlValueAccessor_, este interfaz expone los siguientes métodos:

- OnChange: función de callback a registrar cuando el UI cambia.

- OnTouch: función de callback a registrar cuando el control recibe el evento touch.

- set value: setea el valor usado por en ngModel del elemento.

- writeValue: actualiza el valor de la vista cunado el el valor del modelo cambia (lo cambiamos desde código)

- registerOnChange: Este método se llama cuando el componente padre quiere saber cuando el valor del componente cambia.

- registerOnTouched: aquí marcamos que el componente ha sido tocado (ha pasado el foco por él, esta información se suele usar para no mostrar mensajes de error hasta que se haya tocado el componente).

- registerOnChange: Este método se llama cuando el componente padre quiere saber cuando el valor del componente cambia.

- set value: Este método se llama cuando el componente padre quiere actualizar el valor del componente.

Vamos a implementar todo esta fontanería de primeras sin implementación, ¿Que hacemos aquí?

a) Indicarle en tiempo de run time que hemos implementado el interfaz _ControlValueAccessor_.
b) Indicar que implementamos los métodos que nos obliga a implementar el interfaz _ControlValueAccessor_.
c) Esta parte es "un poco guarrería", dejamos los metodos _onChange_ y _onTouch_ implementados, para que angular los sobreescriba durante el tiempo de ejecución, un tema importante no debemos de implementar nada en estos handlers.
d) Aquí en el write value asignaremos el valor que nos viene del modelo (lo veremos más adelante)

_./src/app/components/input-wrapper/input-wrapper.component.ts_

```diff
- import { Component, Input, forwardRef } from '@angular/core';
+ import { Component, Input, forwardRef } from '@angular/core';
+ import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.css'],
+ // a)
+  providers: [
+    {
+      provide: NG_VALUE_ACCESSOR,
+      useExisting: forwardRef(() => InputWrapperComponent),
+      multi: true
+    }
+  ]
})
- export class InputWrapperComponent {
+ // b)
+ export class InputWrapperComponent implements ControlValueAccessor {
  @Input() label: string;
+ fieldValue = "";

  constructor() {
    this.label = '';
  }

// c)
+  onChange: any = () => {}
+  onTouch: any = () => {}
+  set value(val: string){}
+
+  registerOnChange(fn: any): void {
+    throw new Error('Method not implemented.');
+  }
+  registerOnTouched(fn: any): void {
+    throw new Error('Method not implemented.');
+  }

+  writeValue(obj: any): void {
+    throw new Error('Method not implemented.');
+  }
}
```

Y ahora nos ponemos con la implementación real, primero el setter (asignar el valor usado por el ngModel al elemento html):

- Asignamos el valor que nos llega.
- Disparamos el evento onChange, para indicar que ha cambiado.
- Disparamos el evento onTouch, para indicar que ha perdido el foco.

```diff
  set value(val: string){
+   this.fieldValue = val;
+   this.onChange(val);
+   this.onTouch(val);
  }
```

Ahora vamos con el método writeValue, este método se llama cuando el componente padre quiere actualizar el valor del componente, en nuestro caso lo que tenemos que hacer es llamar al setter que acabamos de implementar:

```diff
  writeValue(obj: any): void {
+   this.fieldValue = obj;
  }
```

Y ahora toca registrar los eventos onChange y onTouch, para ello vamos a implementar los métodos registerOnChange y registerOnTouched:

```diff
  registerOnChange(fn: any): void {
+   this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
+   this.onTouch = fn;
  }
```

- Vámonos ahora al html y enlazamos la propiedad _value_ del componente al elemento \_input interno:

- Aquí por un lado bindeamos la propiedad ngModel al valor que nos viene del modelo.

- Por otro lado notificamos al componente padre de que ha habido un campo qe estaba bindeado.

_./src/app/components/input-wrapper/input-wrapper.component.html_

```diff
  <div class="input-wrapper">
    <label>{{ label }}</label>
-   <input type="text" />
+   <input type="text" [ngModel]="value" (ngModelChange)="onChange($event)"/>
  </div>
```

Vamos a rizar el rizo para, vamos a indicar cuando el component está "tocado" (es decir ha el usuario ha puesto el foco en él elemento y lo ha quitado):

```diff
 <input
  type="text"
  [ngModel]="value"
  (ngModelChange)="onChange($event)"
+ (blur)="onTouch()"
  />
```

- Hora de añadir el _ngModel_ al input que pusimos de prueba en el _game-edit_:

_./src/app/pages/game-edit/game-edit.component.html_

```diff
<form #gameForm="ngForm">
-  <app-input-wrapper label="Name"></app-input-wrapper>
+  <app-input-wrapper label="Name" [(ngModel)]="game.name"></app-input-wrapper>
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
```

- Si te fijas ahora vamos cambiando valores y estos se reflejan en el otro input que tenemos con NgModel, vamos a por la validación, aquí tenemos otro problema, si queremos meter el mensaje de validación en componente, no tenemos forma directa de acceder al _ngModel_ :), tenemos dos opciones para solucionar esto:
  - Dejar la validación fuera de este componente O:-).
  - Aprovechar que tenemos el _ControlValueAccessor_ y en el onInit (que ya angular le ha adjudicado el _ngModel_, sacarlo a una variable que pueda consumir el HTML).

Vamos a complicarnos la vida y vamos a hacer la segunda opción, para ello vamos a implementar el método _ngAfterViewInit_ y vamos a sacar el _ngModel_ a una variable, aquí:

- Nos traemos el _Injector_ para poder acceder al _ngModel_.
- Para no liarnos con nulos, le decimos a TypeScript que no tenga en cuenta el null checking para la variable _formControl_
- Asignamos el form control tiempo de ejecución, y lo pasamos para arriba.

_./src/app/components/input-wrapper/input-wrapper.component.ts_

```diff
- import { Component, Input, forwardRef } from '@angular/core';
+ import { Component, Input, forwardRef, Inject, INJECTOR, Injector } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
+  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

// (...)

export class InputWrapperComponent implements ControlValueAccessor {
  @Input() label: string;
  name: string;
  fieldValue: string;
+ _formControl!: FormControl;

-  constructor() {
+ constructor(@Inject(INJECTOR) private injector: Injector) {
    this.label = '';
    this.fieldValue = '';
    this.name = '';
  }


+  ngAfterViewInit(): void {
+    const ngControl: NgControl | null = this.injector.get(NgControl, null);
+    if (ngControl) {
+      setTimeout(() => {
+        this._formControl = ngControl.control as FormControl;
+      });
+    }
+  }

  onChange: any = () => {};
```

Y en el HTML:

_./src/app/components/input-wrapper/input-wrapper.component.html_

```diff
- <p>input-wrapper works!</p>
<div class="wrapper">
  <label>{{ label }}</label>
  <input
    name="label"
    type="text"
    [ngModel]="value"
    (ngModelChange)="onChange($event)"
    (blur)="onTouch()"
  />
+  <app-field-error-display [fieldNgModel]="_formControl"></app-field-error-display>
</div>
```

Nos falta una cosa más, en el InputField tenemos que añadir un tipo adicional en ese input:

_./src/app/field-error-display.component.ts_

```diff
import { Component, Input } from '@angular/core';
- import { AbstractControl } from '@angular/forms';
+ import { AbstractControl, AbstractControlDirective } from '@angular/forms';


@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.css'],
})
export class FieldErrorDisplayComponent {
  @Input() fieldNgModel:
    | AbstractControlDirective
+    | AbstractControl<any, any>
    | null;

  constructor() {
    this.fieldNgModel = null;
  }
}
```

Ya tenemos el input wrapper con validación, hemos sudado tinta, ahora vamos a reemplazarlo en todos los campos del game edit:

_./src/app/pages/game-edit/game-edit.component.html_

```diff

```

Y ya que estamos vamos a meter esto en un contenedor flex para que se vea mejor:

# Referencias

En estos enlaces encontrarás informacíon más detallada de como implementar _ControlValueAccessor_ en Angular, y todo el problema de tipado que hemos tenido:

https://stackoverflow.com/questions/45659742/angular4-no-value-accessor-for-form-control

https://stackoverflow.com/questions/59086347/controlvalueaccessor-with-error-validation-in-angular-material

https://stackoverflow.com/questions/65486599/error-ts2739-type-abstractcontrol-is-missing-the-following-properties-from-ty

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
