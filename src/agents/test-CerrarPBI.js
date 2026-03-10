import { run } from './CerrarPBISkill.js';
console.time('Test-CerrarPBI');
run({ test: true }).then(res => {
    console.log("Resultado:", res);
    console.timeEnd('Test-CerrarPBI');
});