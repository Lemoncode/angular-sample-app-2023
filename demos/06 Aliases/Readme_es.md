# Aliases

Si te fijas hemos estado trabajando con rutas relativas en los imports, en cuanto un proyecto empieza a crecer esto puede ser un problema, ya que si movemos un fichero de lugar, tendremos que actualizar todas las rutas relativas que apuntan a ese fichero (aquí VS Code te ayuda a veces), pero lo que es peor acertar con un path relativo puede ser complicado.

Vamos a ver como definir alias a nivel de carpeta raíz para que podamos importar de forma más sencilla.

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
```

- En el _tsconfig.json_ vamos a definir aliases para las carpetas que justo cuelguen de _src/app_.

```diff
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
-    ],
+    "baseUrl": "src",
+    "paths": {
+      "@/app/*": ["*"]
+    }
  },
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
