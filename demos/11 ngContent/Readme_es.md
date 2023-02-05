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

```typescript

```

_./src/app/common/modal/modal.component.html_

```typescript

```

Y ¿como ponemos el contenido a voluntad? Pues con la directiva _ngContent_ que nos permite insertar contenido en un componente.

_./src/app/common/modal/modal.component.html_

```typescript

```

Y ahora nos podemos ir al _seller-list.component.html_ y sustituir el modal por el componente que acabamos de crear.

_./src/app/seller/seller-list.component.html_

```html

```

Y eliminar código

_./src/app/seller/seller-list.component.ts_

```typescript

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
