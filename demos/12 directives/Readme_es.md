# Directivas de atributo

Hasta ahora hemos visto como añadir UI en nuestra aplicación a base de crear componentes, pero y ¿si queremos añadir funcionalidad a un elemento HTML o un componente? ¿Y si quisieramos que esa funcionalidad la pudiera reutilizar en otros componentes, no sólo el que he creado? Pues para eso están las directivas.

Las directivas son una forma de extender el comportamiento de los elementos HTML.

Para entender como funciona, vamos a implementar un ejemplo parecido al que podemos encontrar en la documentación oficial de Angular [https://angular.io/guide/attribute-directives](https://angular.io/guide/attribute-directives) que es bastante completo.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- Vamos a creare una directiva de atributo que nos permita cambiar el color del texto de un elemento

```bash
ng g d ./common/highlight
```

- Vamos a modificar el fichero `highlight.directive.ts` para que tenga el siguiente contenido:

```diff
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @Input() set appHighlight(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
```

¿Qué estamos haciendo aquí?

- Indicamos que vamos a crear un directiva.
- El atributo que usaremos en el html va a ser _appHighLight_
- Ponemos como parámetro de entrada el mismo _appHighLight_ así podemos indicarle desde fuera que color queremos que tenga el fondo (podríamos ponerle también un color por defecto).
- Ahí lo que hacemos es acceder al elemento HTML (this.el.nativeElement) y le cambiamos el color.

Vamos ahora a usarlo en la lista de juegos:

_./src/app/pages/game-list/game-card/game-card.component.html_

```diff
<div class="card">
  <div class="card_image">
    <img [src]="game.imageUrl" (click)="handleImageClick()" />
  </div>
-  <div class="card_title title-white" (click)="onTitleClick()">
+  <div class="card_title title-white" (click)="onTitleClick()" highlight="red">

    {{ game.name }} ({{ game.dateRelease | date : "yyyy" | gameOffer  }})
  </div>
</div>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
