# Instrucciones para el Agente

  Agente, lee el diff a continuación y genera un mensaje de commit usando Conventional Commits. Pregúntame si quiero aplicarlo. Si te digo que sí, ejecuta en la terminal el comando de git commit con ese mensaje, y luego ejecuta el orquestador para llamar a RegistradorCommitSkill y actualizar la BITACORA.md. Diff:

---

## Git Diff

```diff
diff --git a/src/index.js b/src/index.js
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
 main();
```
