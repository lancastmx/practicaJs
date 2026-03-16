import { run } from './agents/GestionPBISkill.js';

const result = await run({
    nombre: 'narrativa-commit-skill',
    descripcion: `Implementar el flujo Human-in-the-loop para commits inteligentes.

## Contexto
Separar la responsabilidad del commit en dos agentes:
- NarrativaCommitSkill: Lee el git diff y redacta un mensaje de commit usando Gemini AI.
- AutoCommitSkill (actualizado): Orquesta el flujo, muestra la propuesta al usuario y espera aprobación antes de ejecutar.

## Alcance
1. Crear NarrativaCommitSkill.js que reciba un diff y devuelva un mensaje de commit en lenguaje natural usando Gemini (gemini-2.5-flash).
2. Actualizar AutoCommitSkill.js para:
   - Llamar a NarrativaCommitSkill con el diff staged.
   - Mostrar el mensaje propuesto en la terminal (en color cyan).
   - Pausar y preguntar al usuario: ¿Quieres proceder? (s/n).
   - Solo ejecutar git commit si el usuario aprueba.
3. Actualizar AGENTS.md para registrar NarrativaCommitSkill.
4. Crear la skill documentation en .agent/skills/NarrativaCommit.md.`
});

console.log(JSON.stringify(result, null, 2));
