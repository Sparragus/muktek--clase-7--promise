const step = 7;
const ONE_SECOND = 1000;
const img = document.querySelector("#pug");

function grow(el) {
  el.style.transition = "width 2s";
  el.style.width = "500";
}

/*
  (1)
  Este script cargo una imagen en la variable `img`. Cuando la imagen termina
  de cargar, debe llamar una función que hace que la imagen crezca.

  Si hay un error, escribe el error en la consola.
*/
if (step === 1) {
  img.addEventListener("load", () => grow(img));
  img.addEventListener("error", () => console.error("Something bad happened"));
}

/*
  (2)
  No siempre eso es un problema, pero si la imagen se carga __antes__ de que
  se establezca el event handler de load (o de error), nunca se va a a llamar
  `grow`. Esto es particulamente cierto cuando ocurren procesos asincronos,
  lo cual es muy común en JavaScript.

  Usando setTimeout, vamos a crear un proceso que se ejecuta asincronamente.
  Veran que como la imagen se carga antes de que nosotros podamos añadir un
  eventHandler a `load`, este nuna va a a ejecutar la llamada a `grow`
*/
if (step === 2) {
  setTimeout(() => {
    img.addEventListener("load", () => grow(img));
    img.addEventListener("error", () => console.error("Dude, where's my pug?"));
  }, ONE_SECOND);
}

/* 
  (3)
  Una forma de solucionar este problema es verficando si la imagen cargó
  antes de que añadamos el event handler.

  Esto lo podemos hacer leyendo la propiedad `complete` que tienen las
  images. Esta propiedad es un boolean que es cierto si la imagen ya cargó.

  En caso de que sea cierto, llamamos `handleLoad`. Si no lo que, entonces sí
  tenemos que esperar al evento `load` y luego llamar `handleLoad.
*/
if (step === 3) {
  function handleLoad() {
    grow(img);
  }

  if (img.complete) {
    console.log("Completed before listening for `load` event.");
    handleLoad();
  } else {
    console.log("Listening for `load` event.");
    img.addEventListener("load", handleLoad);
  }

  img.addEventListener("error", () => console.error("Oops. No pug for you."));
}

/*
  (4)
  Los eventos son buena idea cuando queremos estar atentos a cosas que
  pueden pasar multiples veces en un mismo elemento. Por ejemplo, en el caso
  de un input, queremos estar enterados de cada vez que hay un cambio:
  `change`, `keyPress`, `focus`, `blur`. Estas son cosas que no te interesan
  saber antes de que el evento exista.

  Pero para escuchar eventos que tienen que ver con exito/error, sería ideal
  tener una interfaz como la siguiente:
*/
if (step === 4) {
  // ⚠️ PSEUDO-CÓDIGO ⚠️
  img
    .ifCompleteOrWhenLoaded(() => {
      grow(img);
    })
    .orIfError(() => {
      console.error("We will have to live a life without pugs. :(");
    });
}

/*
  (5)
  Esto es exactamente lo que hacen las promesas. Incluso, tienen mejores
  nombres de funciones.

  Si img implementara un método que se llame `ready` que regresara una promesa,
  entonces usando pudieramos hacer algo así:
*/
if (step === 5) {
  // ⚠️ PSEUDO-CÓDIGO ⚠️
  const promise = img.ready();

  promise.then(
    // El primer argumento del `then` es el caso de éxito
    () => grow(img),
    // Y el segundo es el caso de error
    () => console.error("Triste vida sin pugs")
  );
}

/*
  (6)
  La idea básica de las promesas es parecida a la de los eventos, llamar
  funciones cuando ocurre 'algo'. Ese 'algo' es muy particular en las
  promesas: éxito o error.

  Además, las promesas tiene una diferencia muy importante:
  Una promesa solo puede tener éxito o error una vez. Nunca dos veces
  ni tampoco puede cambiar de éxito a error, o viceversa.

  Para crear una promesa hay que usar el constructor `Promise`. `Promise`
  solo recibe un argumento: una función con dos argumentos (resolve y reject)
  donde eventualmente se llama uno de ellos. En el caso de éxito se llama
  resolve con un posible valor, y en el caso de error se llama reject con
  un posible error.

  Mientras no se llama resolve ni reject, decimos que la promesa está
  pendiente, o `pending`. Una vez se llama resolve, la promesa está
  `resolved` o `fulfilled`. Y si se rechaza la promesa, la promesa está
  `rejected`.
*/
if (step === 6) {
  const promise = new Promise((resolve, reject) => {
    if (/* everything is okay */ 1) {
      resolve("It works!");
    } else {
      const error = new Error("Oops. It wasn't me.");
      reject(error);
    }
  });

  promise.then(
    // Esto debe imprimir "It works!". Ese fue el valor con el que hicimos
    // resolve
    value => console.log(value),

    // Pero en caso de que se rechace, entonces recibimos un error con un
    // mensaje "Oops..."
    error => console.error(error)
  );
}

/*
  (7)
  Usemos una promesa para poder implementar el `ready` que quisimos usar en
  el paso (5).
*/
if (step === 7) {
  function imageReady(imageElement) {
    return new Promise((resolve, reject) => {
      if (imageElement.complete) {
        resolve();
      } else {
        imageElement.addEventListener("load", () => {
          resolve();
        });
      }

      imageElement.addEventListener("error", error => {
        reject(error);
      });
    });
  }

  imageReady(img).then(
    // Cuando ya la image esté lista entonces...
    () => grow(img),
    // Si ocurre un error...
    error => console.error(error)
  );
}
