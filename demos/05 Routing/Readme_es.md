# Routing

Hasta ahora hemos estado apilando componentes directamente en App, pero en una aplicación real solemos dividirla en páginas, para ello Angular nos ofrece el concepto de routing, que nos permite definir componentes que se van a mostrar en función de la url y navegación entre páginas.

En este ejemplo vamos crear una página de listado de juegos (moveremos todo lo que hay en app a esa página) y una página que permite crear un juego.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- Vamos a crear una nueva carpeta que vamos a llamar _pages_, dentro de ella vamos a crear dos componentes, uno para la página de listado de juegos y otro para la página de creación de juegos, para ello ejecutamos los siguientes comandos:

```bash
ng generate component pages/game-list
```

```bash
ng generate component pages/game-edit
```

- Vamos ahora a indicarle a la aplicación:
  - Que vamos a utilizar el modulo _@angular/router_
  - Definir las rutas de nuestra aplicación.
  - Asociarlas al router.

_./src/app/app.module.ts_

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
+ import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CardGameComponent } from './card-game/card-game.component';
import { SellerListComponent } from './seller-list/seller-list.component';

+const appRoutes: Routes = [
+  { path: '/', component: CardGameComponent },
+  { path: 'edit', component: SellerListComponent },
+ ];

@NgModule({
  declarations: [
    AppComponent,
    CardGameComponent,
    SellerListComponent
  ],
  imports: [
    BrowserModule,
+  RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Ahora tenemos que decirle donde va a pintar Angular las ventanas, para ello usaremos el componente _router-outlet_, este componente lo instanciaremos en el _app_ que pasa a ser el componente donde definimos el layout de la aplicación y mostramos la páginas de la ruta actual.

Antes de hacer esto tenemos que pasar todo el contenido de _app_ a _game-list_.

_./src/app/pages/game-list/game-list.component.html_

```diff
```

_./src/app/app.component.ts_

```diff
import { Component } from '@angular/core';
- import { Game } from './model/game.model';
- import { Seller } from './model/seller.model';
- import { GameApiService } from './services/game-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'game-catalog';
-  games: Game[];
-  showSellerList: boolean;
-  sellers: Seller[];

+  constructor() {
-  constructor(private gameApiService: GameApiService) {
-    this.showSellerList = false;
-    this.sellers = [];
-    this.games = [];
-  }

-  loadGames = async () => {
-    this.games = await this.gameApiService.getAll();
-  };

  ngOnInit(): void {
-    this.loadGames();
  }

-  onShowSellerList(sellers: Seller[]) {
-    this.sellers = sellers;
-    this.showSellerList = true;
-  }

-  onCloseSellerList() {
-    this.showSellerList = false;
-  }
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
