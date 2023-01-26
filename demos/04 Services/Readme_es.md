# Servicios

Hasta ahora hemos ido colocando todo el código en los ficheros de componentes, pero en una aplicación real, un componente debe de centrarse en cubrir UI, el resto de concerns debemos de extraerlo, para ello Angular nos ofrece los servicios: una clase que se encarga de realizar una tarea concreta, por ejemplo, obtener datos de un servidor, validar un formulario, etc.

En este ejemplo vamos a encapsular la carga de datos inicial (que de momento es mock) en un servicio, así:

- Por un lado nuestro componente se centrará en mostrar la información.
- Por otro lado nuestro servicio se centrará en obtener la información.
- Es más fácil poder a futuro pasar de mock a fuente de datos real, ya que esta funcionalidad está encapsulada en un servicio.
- A futuro es más fácil poder realizar pruebas unitarias ya que la funcionalidad está encapsulada en un servicio.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- Creamos un nuevo servicio, para ello ejecutamos el siguiente comando:

```bash
ng generate service services/member
```

Este comando:

- Me va a generar los ficheros necesarios para crear un servicio.
- Me va a registrar el servicio en el módulo principal de la aplicación.

- Nos creamos un nuevo método en el servicio, que será el encargado de obtener los datos, en este caso los datos serán mock, pero en un futuro podrían ser datos reales, podemos partir de aquí:

```ts
import { Injectable } from "@angular/core";
import { MemberEntity } from "../model/member";

@Injectable()
export class MemberService {
  getAll(): MemberEntity[] {
    return [
      {
        id: 1457912,
        login: "brauliodiez",
        avatar_url: "https://avatars.githubusercontent.com/u/1457912?v=3",
      },
      {
        id: 4374977,
        login: "Nasdan",
        avatar_url: "https://avatars.githubusercontent.com/u/4374977?v=3",
      },
    ];
  }
}
```

- Pero lo ideal es poner una firma de método que nos permita obtener datos de forma asíncrona, en Angular es muy normal utilizar observables y RxJs, pero de momento nos vamos a quedar con promesas (después migraremos el ejemplo y veremos que ventajas nos aporta RxJs), así que nuestro método quedaría así:

```diff
import { Injectable } from '@angular/core';
import { MemberEntity } from '../model/member';

@Injectable()
export class MemberService {
-  getAll(): MemberEntity[] {
+  getAll(): Promise<MemberEntity[]> {
    return Promise.resolve([
      {
        id: 1457912,
        login: 'brauliodiez',
        avatar_url: 'https://avatars.githubusercontent.com/u/1457912?v=3',
      },
      {
        id: 4374977,
        login: 'Nasdan',
        avatar_url: 'https://avatars.githubusercontent.com/u/4374977?v=3',
      },
-    ];
+    ]);
  }
}
```

- Vamos ahora utilizar este componente en nuestro _app_, para ello utilizamos la inyección de dependencia en Angular, en que consiste:

- Previamente (al crear el componente) hemos registrars el servicio en el módulo principal de la aplicación, para ello vamos a _app.module.ts_

- Ahora que queremos utilizar este servicio en el component, en el decorador @Component añadimos una nueva entrada llamada _providers_ aquí indicamos que servicios queremos usar (es un array, así que podemos indicar varios servicios), en nuestro caso solo tenemos uno, así que lo añadimos.

> Aquí angular usa Inyección de dependencias: es un patrón de diseño que consiste en que un objeto no crea sus dependencias, sino que las recibe de fuera. En Angular, esto se consigue a través de los servicios, que son clases que se inyectan en los componentes.

```diff
import { Component } from '@angular/core';
import { MemberEntity } from './model/member';
+ import { MemberService } from './services/member';

import { Component } from '@angular/core';
import { Game } from './model/game.model';
import { Seller } from './model/seller.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
+  providers: [MemberService],
})
export class AppComponent {
  title = 'game-catalog';
  games: Game[];
  showSellerList: boolean;
  sellers: Seller[];
```

> Un tema importante es que por defecto sólo se crear una instancia por cada servicio para toda la aplicación.

Y sustituimos el código mock por la llamada al servicio (esta vez sabiendo que el metodo me devuelve una promesa):

- En este caso lo eliminamos del constructor.
- Y lo cargamos en el evento ngOnInit, que es el evento que se dispara cuando el componente se ha inicializado (veremos que esto cobra sentido en cuanto pasemos a trabajar con páginas y routing).

_./src/app.component.ts_

```diff
  constructor() {
    this.showSellerList = false;
    this.sellers = [];

-    this.games = [
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
-    ];
-  }

  ngOnInit(): void {
+   this.members = await this.memberService.getAll();
  }

  onShowSellerList(sellers: Seller[]) {
    this.sellers = sellers;
    this.showSellerList = true;
  }
```

Como hemos tocado muchos conceptos nuevos vamos a hacer un pequeño resumen:

- Queremos extraer lógica que no sea de presentación de nuestro componente, para ello creamos un servicio (usamos el CLI para ello y así nos lo registra automáticamente en el módulo de aplicación)
- En ese servicio encapsulamos en un método la carga de la lista de gamecard, ya que estamos lo hacemos asíncrono, así cuando queramos sustituir los datos mock por una llamada a una API real sólo tenemos que tocar la implementación del servicio y no impactará en el componente.
- Para usar el servicio en el componente que queramos utilizamos la inyección de dependencia de Angular, así obtenemos una instancia del servicio y podemos usarlo en el componente.
- A tener en cuenta aunque usemos un servicios en varios componentes, por defecto se creará una sóla instancia.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
