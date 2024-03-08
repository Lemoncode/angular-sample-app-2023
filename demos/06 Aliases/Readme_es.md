# Aliases

Si te fijas hemos estado trabajando con rutas relativas en los imports, en cuanto un proyecto empieza a crecer, esto puede ser un problema. Ya que si movemos un fichero de lugar, tendremos que actualizar todas las rutas relativas que apuntan a ese fichero (aquí VS Code te ayuda a veces), pero lo que es peor es que acertar con un path relativo puede ser complicado.

Vamos a ver cómo definir alias a nivel de carpeta raíz para que podamos importar de forma más sencilla.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- En el _tsconfig.json_ vamos a definir aliases para las carpetas que justo cuelguen de _src/app_.

```diff
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
+   "paths": {
+      "@/*": ["./src/app/*"]
+    },
  },}
```

Con esto le estamos diciendo a TypeScript que cuando vea un import, que empiece por _@_, lo que tiene que hacer es buscar en la carpeta _src/app_ y concatenar lo que este contenido en el carácter asterisco.

Ahora podemos cambiar los path relativos por _@/_, por ejemplo:

_./src/app/pages/game-list/card-game/card-game.component.ts_

```diff
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
- import { Game } from '../../../model/game.model';
- import { Seller } from '../../../model/seller.model';
+ import { Game } from '@/model/game.model';
+ import { Seller } from '@/model/seller.model';


@Component({
```

> En algunos casos puede que estos cambios VSCode no los pille al vuelo, una cosa que puedes es hacer un restart de TypeScript, o algo más radical es cerrar abrir de nuevo el VSCode.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apúntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
