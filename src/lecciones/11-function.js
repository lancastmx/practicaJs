// Funciones

function saludar(nombre) {
    console.log(`Hola ${nombre},
    bienvenido al sistema.`);
}

saludar("Lancast");

// Parametro y Argumentos

function crearUsuario(nombre, edad) {
    return {
        nombre: nombre,
        edad: edad
    }
}

const usuario = crearUsuario("Lancast", 25);
console.log(usuario);

// Arrow Function

const multiplicar = (a, b) => a * b;

console.log(multiplicar(5, 10));

const crearNota = (contenido, Titulo = 'Sin tutulo') => {
    return {
        contenido: contenido,
        Titulo: Titulo,
        creado: Date.now()
    }
}

const nota = crearNota("Hola mundo");
const nota2 = crearNota("Hola mundo", "Titulo 2");
console.log(nota);
console.log(nota2);