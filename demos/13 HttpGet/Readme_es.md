# HttpGet

Hasta ahora hemos trabajado en modo mock, es decir, hemos simulado la respuesta del servidor, ya es hora de empezar a trabajar con el servidor real.

Vamos a levantar una api rest con json server y consumirla desde nuestra aplicación.

Igual estás pensando, ahora viene una _fetch_ y promesas, bueno, podrías trabajar así, pero los chicos de Angular nos aconsejan usar el módulo _HttpClient_ y _observables_

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- Podemos arrancar el ejemplo con _ng serve_

```bash
npm start
```

- Vamos ahora a abrir otra instancia de _visual studio code_ y arrancar nuestro servidor web.

```bash
cd server
```

```bash
npm start
```

Si quieres probarlo desde el navegador puedes acceder a [http://localhost:3001/games](http://localhost:3001/games)

- Como vamos a usar el módulo de _http_ de angular, tenemos que importarlo en el _app.module.ts_

_./src/app/app.module.ts_

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
+ import { HttpClientModule } from '@angular/common/http';
```

Y lo registramos:

```diff
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
+   HttpClientModule
  ],
```

- Ahora vamos a modificar nuestro servicio para que consuma la api rest (ojo vamos a poner las URL harcodeadas, en una aplicación real utilizaríamos variables de entorno para apuntar), que hacemos aquí:

- Importamos el módulo _HttpClient_.
- Lo pedimos tirando de inyección de dependencias en el constructor.
- Cambiamos el método _getAll_ para que devuelva un observable, y lo subscribimos en el componente.

_./src/app/services/game.api.service.ts_

```diff
import { Injectable } from '@angular/core';
import { Game } from '../model/game.model';
import { gameMockCollection } from './game-api.mock';
+ import { HttpClient } from '@angular/common/http';
+ import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
-  constructor() {}
+  constructor(private http: HttpClient) {}


-  getAll(): Promise<Game[]> {
+  getAll(): Observable<Game[]> {
-    return Promise.resolve(gameMockCollection);
+    return this.http.get<Game[]>('http://localhost:3001/games');
  }
```

Vamos a modificar el componente de la página de la lista de juegos para que se suscriba al observable y muestre los datos, ¿Qué hacemos aquí?

- Hemos definido el método de la api para que devuelva un observable.
- Lo invocamos y llamamos al método _subscribe_ para que nos suscribamos al observable.
- Ese método _subscribe_ recibe una función de callback que se ejecutará cuando el observable emita un valor, y aquí es donde asignamos a la propiedad _games_ el valor que nos llega.

_./src/app/pages/game-list/game-list.component.ts_

```diff
-  loadGames = async () => {
+  loadGames = () => {
-    this.games = await this.gameApiService.getAll();
+    this.gameApiService.getAll().subscribe((games) => (this.games = games));
-    console.log(this.games);
  };
```

- Vamos a probarlo (acuérdate de tener levantado del servidor web)

```bash
ng serve
```

> Si no te funciona asegúrate que tienes levantado el servidor web y que estás apuntando al puerto correcto.

- Para manejar errores podemos hacerlo a distintos niveles, vamos a ver cómo controlar esto a nivel de componente: el método _subscribe_ recibe un segundo parámetro que es una función de callback que se ejecutará cuando el observable emita un error.

```diff
  loadGames = async () => {
    this.gameApiService.getAll().subscribe(
        (games) => (this.games = games),
+       (error) =>  alert(error.message);
    );
  };
```

- Para saber más sobre gestión de errores:

https://www.tektutorialshub.com/angular/angular-http-error-handling/

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
