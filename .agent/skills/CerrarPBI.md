# Skill: CerrarPBI
> Cierra la rama PBI actual: hace AutoCommit, mezcla en dev y main, y regresa a dev conservando la rama PBI. usa AutoCommitSkill

## 📂 Archivos y Activos

Lógica: src/agents/CerrarPBISkill.js

Documentación: .agent/skills/CerrarPBI.md

Test: src/agents/test-CerrarPBI.js

Dependencias: 
Llama a: 
 - src/agents/AutoCommitSkill.js
 - .agent/skills/AutoCommit.md

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "CerrarPBI"
- Ante la necesidad de cerrar un Product Backlog Item (PBI), integrarlo en las ramas principales (`dev` y `main`), y conservar la rama local.

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{
  "action": "execute",
  "entryPoint": "src/agents/CerrarPBISkill.js",
  "function": "run",
  "params": {}
}
```

## 📋 Flujo Técnico
1. **Sello de Cierre (AutoCommit)**: Ejecuta `AutoCommitSkill.js` para capturar los últimos cambios dentro de la misma rama del PBI, registrando en `BITACORA.md`.
2. **Captura de Mensaje**: Captura el último mensaje de commit generado en la rama.
3. **Integración en Dev**:
   - `git checkout dev`
   - `git merge [nombre-pbi] --no-ff -m "[mensaje]"`
   - `git push origin dev`
4. **Sincronización en Main**:
   - `git checkout main`
   - `git rebase dev`
   - `git push origin main`
5. **Retorno y Conservación**:
   - `git checkout dev` 
   - La rama PBI original se conserva intacta localmente.