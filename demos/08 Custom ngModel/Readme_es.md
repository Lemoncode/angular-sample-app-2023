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

```html
<div class="wrapper">
  <label>{{ label }}</label>
  <input type="text" />
</div>
```

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

https://www.c-sharpcorner.com/article/how-to-implement-controlvalueaccessor-in-angular/

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
