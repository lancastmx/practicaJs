import { execSync } from 'child_process';

const EXCLUDE = ['BITACORA.md'];

/**
 * Skill: AutoCommit
 *
 * Hace git add ., captura el diff staged y lo retorna como string
 * para que el agente del IDE genere la narrativa del commit.
 */
export const run = async (payload = {}) => {
    try {
        // 1. Preparar staging
        execSync('git add .', { stdio: 'ignore' });

        // 2. Verificar que hay archivos staged (excluyendo bitácora)
        const stagingFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
            .split('\n')
            .filter(f => f && !EXCLUDE.includes(f));

        if (stagingFiles.length === 0) {
            return { success: false, error: 'No hay cambios preparados para commit (excluyendo bitácora).' };
        }

        // 3. Obtener el diff completo de staging
        const diff = execSync('git diff --cached', { encoding: 'utf-8' });

        // 4. Analítica Senior (Detección de "Ensalada de Cambios")
        const lineCount = diff.split('\n').length;
        const fileCount = stagingFiles.length;
        let warning = null;

        if (lineCount > 50 || fileCount > 3) {
            warning = `⚠️ Diff de Senior a Senior: Este commit parece un "cajón de sastre" (${lineCount} líneas, ${fileCount} archivos). Considera usar git add -p para commits atómicos.`;
        }

        console.log('\n✅ Diff capturado. El agente generará el mensaje de commit.\n');
        console.log('📂 Archivos en staging:', stagingFiles.join(', '));
        if (warning) console.log(warning);

        return { success: true, diff, stagingFiles, warning };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
