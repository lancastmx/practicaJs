import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { run as autoCommit } from './AutoCommitSkill.js';

export const run = async (payload = {}) => {
    try {
        const nombre = payload.nombre || 'nuevo';
        const descripcion = payload.descripcion || 'Descripción inicial del PBI.';
        const ramaPBI = `pbi-${nombre}`;

        // 1. git checkout main y git pull origin main
        execSync('git checkout main', { stdio: 'ignore' });
        try {
            execSync('git pull origin main', { stdio: 'ignore' });
        } catch (e) {
            // Ignorar errores menores de red si origin no está accesible o no hay cambios
        }

        // 2. git checkout dev y git merge main
        execSync('git checkout dev', { stdio: 'ignore' });
        execSync('git merge main', { stdio: 'ignore' });

        // 3. Crear rama pbi-[nombre]
        execSync(`git checkout -b ${ramaPBI}`, { stdio: 'ignore' });

        // 4. Generar PBI.md inicial
        const pbiPath = path.join(process.cwd(), 'PBI.md');
        const pbiContent = `# PBI: ${nombre}\n\n## Descripción\n${descripcion}\n\n## Tareas\n- [ ] Tarea inicial\n`;
        fs.writeFileSync(pbiPath, pbiContent, 'utf-8');

        // 5. Llamar a AutoCommit para registrar el inicio del PBI
        const commitResult = await autoCommit();

        return {
            success: true,
            data: {
                rama: ramaPBI,
                pbiFile: pbiPath,
                commit: commitResult
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
