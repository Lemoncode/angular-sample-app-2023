# NgContent

La directiva NgContent nos permite insertar contenido en un componente.

Esto nos permite hacer componentes reutilizables, que pueden ser usados en diferentes contextos, por ejemplo ¿Te acuerdas del diálogo modal que utilizamos para mostrar el listado de vendedores? En esta implementación teníamos un problema, si queríamos implementar otro modal para mostrar otro contenido, tendríamos que crear un nuevo componente y copiar toda la lógica del modal, eso suena raro ¿Verdad?

Vamos a ver como podemos extraer el armazon del modal, e inyectarle el contenido que toque voluntad.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

Vamos a revisar el código de _seller-list.component.html_ y el _ts_

Fijate que este componente hace dos cosas, por un lado mostrar un modal, por otro mostrar el listado de vendedores.

Vamos a extraer el modal en un componente, y vamos a hacer que el contenido del modal sea dinámico, para ello crearemos un componente que se llame _modal.component_ y como va a ser reusable lo vamos a colocar bajo la carpeta _common_

```bash
ng g c common/modal
```

Vamos a copiar el código del modal del _seller-list.component.html_ al _modal.component.html_ y el ts

_./src/app/common/modal/modal.component.ts_

```diff
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
+ @Output() close = new EventEmitter();
+
+  onCloseClick(event?: MouseEvent) {
+    this.close.emit();
+  }
}
```

_./src/app/common/modal/modal.component.css_

```css
/** Modal */
.modal {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.modal-close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
}

/** Overlay */
.overlay {
  opacity: 0.7;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
```

_./src/app/common/modal/modal.component.html_

```diff
- <p>modal works!</p>
+ <div class="overlay"></div>
+  <div class="modal">
+  <button class="modal-close-btn" (click)="onCloseClick($event)">✖️</button>
+   AQUI VA EL CONTENIDO
+ </div>
```

Y ¿como ponemos el contenido a voluntad? Pues con la directiva _ngContent_ que nos permite insertar contenido en un componente.

_./src/app/common/modal/modal.component.html_

```diff
 <div class="overlay"></div>
  <div class="modal">
  <button class="modal-close-btn" (click)="onCloseClick($event)">✖️</button>
-   AQUI VA EL CONTENIDO
+   <ng-content></ng-content>
  </div>
 </div>
```

Y ahora nos podemos ir al _seller-list.component.html_ y elimiar la logica del modal

_./src/app/seller/seller-list.component.html_

```diff
- <div class="overlay"></div>
- <div class="modal">
-  <button class="modal-close-btn" (click)="onCloseClick($event)">✖️</button>
  <h2>Lista de vendedores</h2>
  <div class="seller-grid-container">
    <div class="seller-grid-header">Nombre</div>
    <div class="seller-grid-header">Cantidad</div>
    <div class="seller-grid-header">Precio</div>
    <div class="seller-grid-header">Disponible</div>
    <ng-container *ngFor="let seller of sellers" class="seller-grid-item">
      <span>{{ seller.name }}</span>
      <span>{{ seller.amount }}</span>
      <span>{{ seller.price }}</span>
      <span>{{ seller.isAvailable ? "✅" : "✖️" }}</span>
    </ng-container>
-  </div>
- </div>

```

_./src/app/seller/seller-list.component.css_

```diff
- /** Modal */
- .modal {
-  position: fixed;
-  top: 10px;
-  left: 0;
-  right: 0;
-  max-width: 500px;
-  margin: 0 auto;
-  padding: 30px;
-  background: #fff;
-  border-radius: 4px;
-  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
- }
-
- .modal-close-btn {
-  position: absolute;
-  right: 10px;
-  top: 10px;
-  font-size: 20px;
- }
-
- /** Overlay */
- .overlay {
-  opacity: 0.7;
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
-  bottom: 0;
-  width: 100%;
-  height: 100%;
-  background-color: rgba(0, 0, 0, 0.3);
- }

.seller-grid-container {
  display: grid;
  grid-template-columns: 1fr 80px 60px 90px;
  grid-template-rows: auto;
  padding: 10px;
}

.seller-grid-header {
  background-color: #f2f2f2;
}
```

Y eliminar código

_./src/app/seller/seller-list.component.ts_

```diff
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seller } from '../model/seller.model';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css'],
})
export class SellerListComponent {
-  @Output() close = new EventEmitter();
  @Input() sellers: Seller[];

  constructor() {
    this.sellers = [];
  }

-  onCloseClick(event?: MouseEvent) {
-    this.close.emit();
-  }
}
```

Y directamente en app invocarlo:

_./src/app/app.component.html_

```diff
+ <app-modal *ngIf="showSellerList" (close)="onCloseSellerList()">
<app-seller-list
-  *ngIf="showSellerList"
-  (close)="onCloseSellerList()"
  [sellers]="sellers"
></app-seller-list>
+ </app-modal>
```

Si queremos, ahora podemos facilmente crear otro modal envolviendo el contenido que queramos (ejercicio para el alumno)

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
