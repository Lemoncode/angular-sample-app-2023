# Reactive Forms

Hemos visto como trabajar con formularios de plantilla en Angular con su _ngModel_, todo muy bonito y muy fácil, hasta que quieres hacer algo más allá de un formulario de login o la típica demo con el _happy path_, problemas que tienen:

- Manchamos el HTML con validaciones, es decir metemos en UI lógica de negocio.
- El _ngModel_ me imponen restricciones, todo el proceso de actualización es mágico y sin poder internvenir de manera fácil, por ejemplo, gestionar un input de tipo date y enlazarlo a un campo fecha es algo que no va muy bien.
- Si además queremos crear un componente custom que soporte _ngModel_ tenemos que implementar la interfaz _ControlValueAccessor_ y no es algo directo.

Vamos a ver como podemos resolver estos problemas con _Reactive Forms_, en este caso nos tocará programar algo más de código, pero si tendremos un control más fino de lo que se está haciendo en el formulario.

Los pasos que vamos a seguir son:

1. En el TS del componente de crear juego,definir el formulario reactivo.
2. Cambiamos el HTML y volvemos a componentes básicos (sin NgModel)
3. Reutilizamos las validaciones
4. Arreglamos el problema de la fecha
5. Adaptamos nuestro componente genérico para que utilice Reactive Forms

# Paso a paso

- Partimos del ejemplo anterior, lo copiamos e instalamos las dependencias.

```bash
npm install
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
