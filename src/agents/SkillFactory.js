import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Subimos 3 niveles desde src/agents/ para llegar a la raíz donde está AGENTS.md
const agentsPath = path.join(__dirname, '../../AGENTS.md');

const skillName = process.argv[2];
const description = process.argv[3] || 'Sin descripción';

if (!skillName) {
    console.error("❌ Error: Debes proporcionar un nombre para la skill.");
    process.exit(1);
}

const createSkill = () => {
    const skillPath = path.join(__dirname, `${skillName}Skill.js`);
    const mdPath = path.join(__dirname, `../../.agent/skills/${skillName}.md`);

    const jsContent = `export const run = async (payload) => {\n    console.log("Skill ${skillName} activa");\n    return { success: true };\n};`;
    const mdContent = `# Skill: ${skillName}\n\n${description}\n\n## Uso\n1. Invocar desde AGENTS.md`;

    // Regla estandarizada para el registro
    const nuevaRegla = `\n- **SI** el usuario pide "${skillName}":\n  -> DELEGAR A: \`${skillName}Skill.js\`\n  -> REGLAS DE USO: [.agent/skills/${skillName}.md](.agent/skills/${skillName}.md)`;

    try {
        // Generación de archivos físicos
        fs.writeFileSync(skillPath, jsContent);
        fs.writeFileSync(mdPath, mdContent);

        // Inyección de la regla en el cerebro del sistema
        if (fs.existsSync(agentsPath)) {
            fs.appendFileSync(agentsPath, nuevaRegla);
            console.log(`>>> REGISTRO: AGENTS.md actualizado con la skill ${skillName}.`);
        } else {
            console.warn(`⚠️ Advertencia: No se encontró AGENTS.md en ${agentsPath}`);
        }

        console.log(`>>> FACTORY: Skill [${skillName}] creada exitosamente.`);
    } catch (error) {
        console.error("❌ Error en la fábrica:", error.message);
    }
};

createSkill();