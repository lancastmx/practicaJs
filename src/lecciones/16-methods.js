// Métodos de orden superior

// Map
const notas = [
    { id: 1, title: 'Nota 1', content: 'Comtenido 1' },
    { id: 2, title: 'Nota 2', content: 'Comtenido 2' },
    { id: 3, title: 'Nota 3', content: 'Comtenido 3' },
    { id: 4, title: 'Nota 4', content: 'Comtenido 4' },
    { id: 5, title: 'Nota 5', content: 'Comtenido 5' },
];

console.log(notas);

const notasTitulos = notas.map((nota) => nota.title)
console.log(notasTitulos);

const notasIds = notas.map((nota) => nota.id)
console.log(notasIds);

const notasConFecha = notas.map((nota) => ({
    ...nota,
    feachaCreacions: Date.now()
}))
console.log(notasConFecha);

// Filter
const notas2 = [
    { id: 1, title: 'Nota 1', content: 'Comtenido 1', esFavorita: true },
    { id: 2, title: 'Nota 2', content: 'Comtenido 2', esFavorita: false },
    { id: 3, title: 'Nota 3', content: 'Comtenido 3', esFavorita: true },
    { id: 4, title: 'Nota 4', content: 'Comtenido 4', esFavorita: false },
    { id: 5, title: 'Nota 5', content: 'Comtenido 5', esFavorita: true },
];

const notas2Confecha = notas2.map((notas) => ({
    ...notas2,
    fechaCreacion: Date.now()
}))
const notasFavoritas = notas2.filter((nota) => nota.esFavorita)
console.log('notasFavoritas');
console.log(notasFavoritas);

// Find
const nota1 = notas2.find((nota) => nota.id === 1)
console.log('nota1');
console.log(nota1);

const titulo = notas2.filter((nota) => nota.title.toLowerCase() === 'nota 1')
console.log('titulo');
console.log(titulo);