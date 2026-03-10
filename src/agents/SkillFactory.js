import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsPath = path.join(__dirname, '../../AGENTS.md');

const skillName = process.argv[2];
const description = process.argv[3] || 'Sin descripción';

const createSkill = () => {
    const paths = {
        js: path.join(__dirname, `${skillName}Skill.js`),
        md: path.join(__dirname, `../../.agent/skills/${skillName}.md`),
        test: path.join(__dirname, `test-${skillName}.js`)
    };

    // ESTÁNDAR DE DOCUMENTACIÓN (Lógica de aplicación)
    const mdContent = `
# Skill: ${skillName}
> ${description}

## 🧠 Cuándo aplicar (Trigger)
- Cuando el usuario solicite explícitamente: "${skillName}"
- Ante la necesidad de: ${description}

## ⚙️ Cómo aplicar (Payload)
El Orquestador debe enviar:
\`\`\`json
{ "action": "execute", "params": {} }
\`\`\`
`.trim();

    // SCRIPT DE PRUEBA INSTANTÁNEA
    const testContent = `
import { run } from './${skillName}Skill.js';
console.time('Test-${skillName}');
run({ test: true }).then(res => {
    console.log("Resultado:", res);
    console.timeEnd('Test-${skillName}');
});`.trim();

    try {
        fs.writeFileSync(paths.js, `export const run = async (p) => ({ success: true, data: p });`);
        fs.writeFileSync(paths.md, mdContent);
        fs.writeFileSync(paths.test, testContent);

        // Auto-registro en AGENTS.md
        const regla = `\n- **SI** pide "${skillName}": -> DELEGAR A: \`${skillName}Skill.js\` -> REGLAS DE USO: [.agent/workflows/verify-skills.md](.agent/skills/${skillName}.md)`;
        fs.appendFileSync(agentsPath, regla);

        console.log(`✅ Skill [${skillName}] creada, registrada y con test listo.`);
    } catch (e) { console.error("Error:", e.message); }
};
createSkill();