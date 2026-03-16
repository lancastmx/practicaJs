import { execSync } from 'child_process';
import { run as generarNarrativa } from './NarrativaCommitSkill.js';

const EXCLUDE = ['BITACORA.md'];

export const run = async (payload = {}) => {
    try {
        // 1. Preparar staging
        execSync('git add .', { stdio: 'ignore' });

        // 2. Verificar que hay cambios staged (excluyendo bitácora)
        const stagingFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
            .split('\n')
            .filter(f => f && !EXCLUDE.includes(f));

        if (stagingFiles.length === 0) {
            return { success: false, error: 'No hay cambios preparados para commit (excluyendo bitácora).' };
        }

        // 3. Obtener el diff completo de staging
        const diffCompleto = execSync('git diff --cached', { encoding: 'utf-8' });

        // 4. Delegar la creación del prompt a NarrativaCommitSkill
        const resultado = await generarNarrativa(diffCompleto);

        return { success: resultado.success, data: resultado };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
