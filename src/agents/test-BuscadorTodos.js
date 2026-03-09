import { run } from './BuscadorTodosSkill.js';
console.time('Test-BuscadorTodos');
run({ test: true }).then(res => {
    console.log("Resultado:", res);
    console.timeEnd('Test-BuscadorTodos');
});