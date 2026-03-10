import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsPath = path.join(__dirname, '../../AGENTS.md');

const skillName = process.argv[2];
const description = process.argv[3] || 'Sin descripción';

import { execSync } from 'child_process';

const createSkill = () => {
    const paths = {
        js: path.join(__dirname, `${skillName}Skill.js`),
        md: path.join(__dirname, `../../.agent/skills/${skillName}.md`),
        test: path.join(__dirname, `test-${skillName}.js`)
    };

    // Detectar dependencias en la descripción ("usa X", "depende de Y", etc)
    const depRegex = /(?:usa|requiere|depende de|llama a)\s+([a-zA-Z0-9_-]+)/gi;
    let dependsOn = [];
    let match;
    while ((match = depRegex.exec(description)) !== null) {
        let depName = match[1];
        if (depName.toLowerCase().endsWith('skill')) {
            depName = depName.substring(0, depName.length - 5);
        }
        dependsOn.push(depName);
    }

    let depListString = '[Ninguna especial]';
    let depComments = '';

    if (dependsOn.length > 0) {
        depListString = `Llama a: \n` + dependsOn.map(d => ` - src/agents/${d}Skill.js\n - .agent/skills/${d}.md`).join('\n');
        depComments = `// Dependencias detectadas: \n// ` + dependsOn.map(d => `src/agents/${d}Skill.js`).join('\n// ') + '\n';

        // Verificar existencia y crear si falta
        for (const dep of dependsOn) {
            const depJsPath = path.join(__dirname, `${dep}Skill.js`);
            if (!fs.existsSync(depJsPath)) {
                console.log(`⚠️ Dependencia faltante detectada: ${dep}. Creando recursivamente...`);
                try {
                    execSync(`node ${__filename} "${dep}" "Dependencia auto-generada para ${skillName}"`, { stdio: 'inherit' });
                } catch (err) {
                    console.error(`Error al crear la dependencia ${dep}:`, err.message);
                }
            }
        }
    }

    // ESTÁNDAR DE DOCUMENTACIÓN (Lógica de aplicación)
    const mdContent = `
# Skill: ${skillName}
> ${description}

## 📂 Archivos y Activos

Lógica: src/agents/${skillName}Skill.js

Documentación: .agent/skills/${skillName}.md

Test: src/agents/test-${skillName}.js

Dependencias: \n${depListString}

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
}); `.trim();

    try {
        fs.writeFileSync(paths.js, `${depComments}export const run = async (p) => ({ success: true, data: p }); \n`);
        fs.writeFileSync(paths.md, mdContent);
        fs.writeFileSync(paths.test, testContent);

        // Auto-registro en AGENTS.md
        const regla = `\n- **SI** pide "${skillName}": -> DELEGAR A: \`${skillName}Skill.js\` -> REGLAS DE USO: [.agent/skills/${skillName}.md](.agent/skills/${skillName}.md)`;
        if (!fs.existsSync(agentsPath) || !fs.readFileSync(agentsPath, 'utf8').includes(`- **SI** pide "${skillName}":`)) {
            fs.appendFileSync(agentsPath, regla);
        }

        console.log(`✅ Skill [${skillName}] creada, registrada y con test listo.`);
    } catch (e) { console.error("Error:", e.message); }
};
createSkill();