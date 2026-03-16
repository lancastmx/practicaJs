# Skill: AutoCommit
> Prepara staging (`git add .`), captura el `git diff --cached` y lo devuelve como string para que el agente del IDE genere la narrativa del commit.

## 📂 Archivos y Activos

Lógica: `agents/AutoCommitSkill.js`

Documentación: `.agent/skills/AutoCommit.md`

Test: `agents/test-AutoCommit.js`

Dependencias: Ninguna. El agente del IDE asume el rol de generar el mensaje.

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite: "Commit", "agrega commit", "haz commit" o "crea commit"

## ⚙️ Cómo aplicar (Payload)
```json
{
  "action": "execute",
  "entryPoint": "agents/AutoCommitSkill.js",
  "function": "run",
  "params": {}
}
```

## 📋 Flujo completo (Agente del IDE)

1. **Ejecutar skill** → devuelve `{ diff, stagingFiles }`
2. **Agente lee el diff** y genera un mensaje de commit en Conventional Commits
3. **Agente pregunta** al usuario si desea aplicarlo
4. **Si el usuario dice SÍ**, el agente ejecuta:
   ```bash
   git commit -m "[narrativa generada]"
   ```
5. **Agente llama a `RegistradorCommitSkill`** pasando el hash, autor y narrativa para insertar en `BITACORA.md` en la sección "Cambios Técnicos"
6. **Agente cierra el ciclo:**
   ```bash
   git add BITACORA.md
   git commit --amend --no-edit
   ```