- **SI** el usuario pide "crear una skill" o "nueva herramienta":
  -> DELEGAR A: `SkillFactory.js`
  -> ACCIÓN: Ejecutar en terminal `node src/agents/SkillFactory.js [nombre] "[descripcion]"`

> **🚫 REGLA ESTRICTA DEL ORQUESTADOR:** QUEDA TERMINANTEMENTE PROHIBIDO ejecutar archivos que comiencen con el prefijo `test-` (e.g. `test-AutoCommit.js`) para llevar a cabo solicitudes de producción de usuario. El Orquestador DEBE SIEMPRE usar el archivo lógico real definido en el `entryPoint` (e.g. `src/agents/AutoCommitSkill.js`).
- **SI** el usuario pide "LectorLogs":
  -> DELEGAR A: `LectorLogsSkill.js`
  -> REGLAS DE USO: [.agent/skills/LectorLogs.md](.agent/skills/LectorLogs.md)
- **SI** pide "BuscadorTodos": -> DELEGAR A: `BuscadorTodosSkill.js` -> REGLAS DE USO: [.agent/skills/BuscadorTodos.md](.agent/skills/BuscadorTodos.md)
- **SI** pide "RegistradorCommit": -> DELEGAR A: `RegistradorCommitSkill.js` -> REGLAS DE USO: [.agent/skills/RegistradorCommit.md](.agent/skills/RegistradorCommit.md)
- **SI** pide "AutoCommit": -> DELEGAR A: `AutoCommitSkill.js` -> REGLAS DE USO: [.agent/skills/AutoCommit.md](.agent/skills/AutoCommit.md)
- **SI** pide "doc-expert": -> DELEGAR A: `doc-expertSkill.js` -> REGLAS DE USO: [.agent/skills/doc-expert.md](.agent/skills/doc-expert.md)
- **SI** pide "GestionPBI": -> DELEGAR A: `GestionPBISkill.js` -> REGLAS DE USO: [.agent/skills/GestionPBI.md](.agent/skills/GestionPBI.md)
- **SI** pide "CerrarPBI": -> DELEGAR A: `CerrarPBISkill.js` -> REGLAS DE USO: [.agent/skills/CerrarPBI.md](.agent/skills/CerrarPBI.md)