// Ejemplos de scope global y local

// Scope global
const nombre = "Lancast";


function mostrarNombre() {
    console.log(nombre);
}
mostrarNombre();

// Scope local
function mostrarApellido() {
    const apellido = "Lancast";
    console.log(apellido);
}
mostrarApellido();

// explicacion de scope
// scope es el alcance de una variable
// scope global es el alcance de una variable que se puede usar en cualquier parte del codigo
// scope local es el alcance de una variable que solo se puede usar en el bloque de codigo donde se define