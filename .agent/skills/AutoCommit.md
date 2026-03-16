# Skill: AutoCommit
> Prepara los archivos en staging (git add .), obtiene el diff y delega la creación del archivo de prompt a NarrativaCommitSkill. Ya no hace el commit directamente.

## 📂 Archivos y Activos

Lógica: `agents/AutoCommitSkill.js`

Documentación: `.agent/skills/AutoCommit.md`

Test: `agents/test-AutoCommit.js`

Dependencias: Llama a `agents/NarrativaCommitSkill.js` para generar `.agent/temp/PROMPT_COMMIT.md`.

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "Commit", "agrega commit", "haz commit" o "crea commit"
- Ante la necesidad de: Preparar staging y delegar la narrativa del commit al agente del IDE

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
```json
{
  "action": "execute",
  "entryPoint": "agents/AutoCommitSkill.js",
  "function": "run",
  "params": {}
}
```

## 📋 Flujo de trabajo

1. Ejecuta `git add .` para preparar todos los cambios
2. Verifica que haya archivos staged (excluye `BITACORA.md`)
3. Obtiene el diff completo con `git diff --cached`
4. Delega a `NarrativaCommitSkill` → genera `.agent/temp/PROMPT_COMMIT.md`
5. El agente del IDE lee el archivo y genera el commit en Conventional Commits
6. Si el usuario aprueba, el agente ejecuta `git commit` y luego llama a `RegistradorCommitSkill`