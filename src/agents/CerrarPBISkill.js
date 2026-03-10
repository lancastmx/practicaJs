import { execSync } from 'child_process';
import { run as runAutoCommit } from './AutoCommitSkill.js';

export const run = async (payload = {}) => {
    try {
        // Obtener el nombre de la rama actual (PBI)
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();

        if (currentBranch === 'dev' || currentBranch === 'main') {
            return { success: false, error: `No puedes cerrar PBI desde la rama ${currentBranch}. Debes estar en la rama del PBI.` };
        }

        console.log(`[CerrarPBI] Ejecutando Sello de Cierre en la rama: ${currentBranch}`);

        // 1. Sello de Cierre (AutoCommit)
        const autoCommitResult = await runAutoCommit();
        if (!autoCommitResult.success && !payload.force) {
            console.log(`[CerrarPBI] AutoCommit info: ${autoCommitResult.error}`);
            // Continuamos porque puede que ya se hayan hecho los commits manualmente antes
        }

        // 2. Captura de Mensaje
        const lastCommitMsg = execSync('git log -1 --pretty=%s', { encoding: 'utf-8' }).trim();
        console.log(`[CerrarPBI] Mensaje capturado: "${lastCommitMsg}"`);

        // Escape double quotes in lastCommitMsg to prevent issues in the merge command
        const safeMessage = lastCommitMsg.replace(/"/g, '\\"');

        // 3. Integración en Dev
        console.log('[CerrarPBI] Integrando en dev...');
        execSync('git checkout dev', { stdio: 'inherit' });
        execSync(`git merge ${currentBranch} --no-ff -m "${safeMessage}"`, { stdio: 'inherit' });
        execSync('git push origin dev', { stdio: 'inherit' });

        // 4. Sincronización de Main
        console.log('[CerrarPBI] Sincronizando main...');
        execSync('git checkout main', { stdio: 'inherit' });
        execSync('git rebase dev', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });

        // 5. Retorno y Conservación
        console.log(`[CerrarPBI] Regresando a dev. La rama ${currentBranch} se conserva localmente.`);
        execSync('git checkout dev', { stdio: 'inherit' });

        return { success: true, data: { status: 'PBI Cerrado Exitosamente', branch: currentBranch, message: lastCommitMsg } };
    } catch (error) {
        console.error('[CerrarPBI] Error durante el proceso:', error.message);
        // Intentar regresar a donde estábamos si falla algo a la mitad
        try { execSync('git checkout dev', { stdio: 'ignore' }); } catch (e) { }
        return { success: false, error: error.message };
    }
};
