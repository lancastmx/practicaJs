import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsPath = path.join(__dirname, '../../../AGENTS.md'); // Ruta al AGENTS.md raíz

const skillName = process.argv[2] || 'nuevaSkill';
const description = process.argv[3] || 'Sin descripción';

const createSkill = () => {
    // 1. Definir rutas
    const skillPath = path.join(__dirname, `${skillName}Skill.js`);
    const mdPath = path.join(__dirname, `../../.agent/skills/${skillName}.md`);

    // 2. Contenido de los archivos
    const jsContent = `export const run = () => console.log("Skill ${skillName} activa");`;
    const mdContent = `# Skill: ${skillName}\n\n${description}`;

    // 3. La nueva regla para AGENTS.md
    const nuevaRegla = `\n- **SI** el usuario pide "${skillName}":\n  -> DELEGAR A: \`${skillName}Skill.js\`\n  -> REGLAS DE USO: [.agent/workflows/verify-skills.md](.agent/workflows/verify-skills.md)`;

    try {
        // Escribir los archivos base
        fs.writeFileSync(skillPath, jsContent);
        fs.writeFileSync(mdPath, mdContent);

        // 4. AUTO-REGISTRO: Inyectar la regla en AGENTS.md
        if (fs.existsSync(agentsPath)) {
            fs.appendFileSync(agentsPath, nuevaRegla);
            console.log(`>>> REGISTRO: AGENTS.md actualizado con la skill ${skillName}.`);
        }

        console.log(`>>> FACTORY: Skill [${skillName}] creada exitosamente.`);
    } catch (error) {
        console.error("Error en la fábrica:", error.message);
    }
};

createSkill();