import { run } from './GestionPBISkill.js';
console.time('Test-GestionPBI');
run({
    nombre: 'git-flow-automation',
    descripcion: 'Implementar la lógica robusta en GestionPBISkill.js que gestione los checkouts de main y dev, cree la rama de tarea y dispare el AutoCommit al finalizar.'
}).then(res => {
    console.log("Resultado:", res);
    console.timeEnd('Test-GestionPBI');
});