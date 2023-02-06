# Http Post

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- Podemos arrancar el ejemplo con _ng serve_

```bash
npm start
```

- Vamos ahora a abrir otra instancia de visual studiocode y arrancar nuestro servidor web.

```bash
cd server
```

```bash
npm start
```

Si quieres probarlo desde el navegador puedes acceder a [http://localhost:3000/games](http://localhost:3000/games)

- Vamos a implementar el insert game con llamada a la api rest, para ello vamos a hacer lo siguiente:

_./src/app/services/game.api.service.ts_

```diff
-  Insert(game: Game): Promise<Game> {
+  Insert(game: Game): Observable<Game> {
-    gameMockCollection.push(game);
-    return Promise.resolve(game);
+    return this.http.post<Game>(`localhost:3001/games`, game);
  }
```

> Ten cuidado con el puerto de localhost, si no lo pones bien no funcionará, y asegurate que está el servidor levantado.

Vamos al lado del componente, ejecutamos la operación y esperamos la respuesta usando observables:

_./src/app/components/pages/game-edit/game.edit.component.ts_

```diff
  handleSaveClick() {
    if (this.gameForm.valid) {
-      console.log(this.gameForm.value);
      const game = mapVmToGame(this.gameForm.value);
-      this.gameApi.Insert(game);
+      this.gameApi.Insert(game).subscribe({
+        next: (game) => {
+          alert('Juego insertado correctamente');
+          console.log(game);
+        },
+        error: (error) => {
+          alert('Error al insertar el juego');
+          console.log(error);
+        },
+      });
    } else {
      // TODO: esto habría que hacerlo más limpio, usando por ejemplo una notificación de angular material :)
      alert(
        'Formulario inválido, chequea si hay errores de validación en alguno de los campos del formulario'
      );
    }
  }
```

Vamos a probar a insertar este juego

Nombre: Streets of Rage 4
Imagen Url:
https://raw.githubusercontent.com/Lemoncode/angular-sample-app-2023/main/media/streetsofrage4.jpeg
Fecha: 2020-04-30

Como estamos en dominios separados, tenemos un error de CORS, aquí tenemos dos opciones:

- Si en producción desplegamos en el mismo dominio que la api, podemos usar en local un proxy.
- Si no, tenemos que configurar CORS para que permite hacer un post desde otro dominio.

Más info: https://www.stackhawk.com/blog/angular-cors-guide-examples-and-how-to-enable-it/

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
