# Skill: NarrativaCommit
> Genera un mensaje de commit narrativo guardando el diff y un prompt estructurado en `.agent/temp/PROMPT_COMMIT.md` para que el agente lo procese.

## 📂 Archivos y Activos

Lógica: `agents/NarrativaCommitSkill.js`

Documentación: `.agent/skills/NarrativaCommit.md`

Test: `agents/test-NarrativaCommit.js`

Dependencias: [Ninguna externa — sin APIs de IA]

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: `"NarrativaCommit"`
- Ante la necesidad de: Generar un prompt de commit narrativo a partir de un `git diff`

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar el contenido del `git diff` como string dentro de `params.diff`:

```json
{
  "action": "execute",
  "entryPoint": "agents/NarrativaCommitSkill.js",
  "function": "run",
  "params": {
    "diff": "<contenido completo del git diff aquí>"
  }
}
```

## 📋 Flujo de trabajo

1. El agente ejecuta `git diff HEAD` y pasa la salida como `payload` a `run()`.
2. La skill crea `.agent/temp/` si no existe.
3. Guarda en `.agent/temp/PROMPT_COMMIT.md` el diff y el siguiente prompt:
   > *"Agente, lee el diff a continuación y genera un mensaje de commit usando Conventional Commits. Explica qué cambió y por qué. Luego de darme el mensaje, pregúntame si quiero que lo apliques."*
4. Imprime en consola un mensaje llamativo indicando al usuario que abra el chat y escriba:
   `"Ejecuta las instrucciones de .agent/temp/PROMPT_COMMIT.md"`

## ⚠️ Restricciones
- **No usa APIs externas** (ni `@google/genai`, ni `fetch`). La inteligencia la provee el agente del IDE al procesar el archivo generado.
- El archivo `PROMPT_COMMIT.md` se sobreescribe cada vez que se ejecuta la skill.
