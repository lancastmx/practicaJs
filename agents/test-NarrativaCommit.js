import { run } from './NarrativaCommitSkill.js';

// Diff de ejemplo para pruebas
const sampleDiff = `diff --git a/src/index.js b/src/index.js
index abc1234..def5678 100644
--- a/src/index.js
+++ b/src/index.js
@@ -1,5 +1,8 @@
 // Aplicación principal
+import { greet } from './utils/greet.js';
+
 const main = () => {
-  console.log('Hola mundo');
+  const msg = greet('mundo');
+  console.log(msg);
 };
 main();`;

console.time('Test-NarrativaCommit');
run(sampleDiff).then(res => {
    console.log('Resultado:', res);
    console.timeEnd('Test-NarrativaCommit');
});
