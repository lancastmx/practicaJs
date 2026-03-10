import { run } from './RegistradorCommitSkill.js';
console.time('Test-RegistradorCommit');
run({}).then(res => {
    console.log("Resultado Incremental:", res);
    console.timeEnd('Test-RegistradorCommit');
});