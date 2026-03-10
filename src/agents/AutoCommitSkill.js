import { execSync } from 'child_process';
import { run as registrarEnBitacora } from './RegistradorCommitSkill.js';

export const run = async (payload = {}) => {
    try {
        // 1. Obtener archivos en staging (excluyendo bitácora)
        const stagingFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
            .split('\n').filter(f => f && f !== 'BITACORA.md');

        if (stagingFiles.length === 0) {
            return { success: false, error: "No hay cambios preparados para commit." };
        }

        // 2. Análisis técnico del Diff
        const diff = execSync(`git diff --cached --unified=0 -- ${stagingFiles.join(' ')}`, { encoding: 'utf-8' });
        const lineas = diff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));

        // Heurística de explicación
        const cambios = stagingFiles.map(file => {
            const ext = file.split('.').pop();
            const base = `Archivo: ${file}`;
            if (ext === 'js' || ext === 'ts') {
                const funcs = lineas.filter(l => l.match(/(function|const|class)\s+(\w+)/)).map(l => l.match(/(?:const|function|class)\s+(\w+)/)[1]);
                return `${base} -> ${funcs.length > 0 ? `Añade/Modifica: ${funcs.join(', ')}` : 'Cambios de lógica interna'}`;
            }
            if (ext === 'md') {
                const headers = lineas.filter(l => l.startsWith('+##')).map(l => l.replace(/^\+##\s+/, '').trim());
                return `${base} -> Actualiza secciones: ${headers.join(', ') || 'Contenido general'}`;
            }
            return `${base} -> Actualización de datos`;
        });

        const explicacionNarrativa = cambios.join('\n- ');
        const mensajeCommit = `feat: ${stagingFiles.slice(0, 2).join(', ')}${stagingFiles.length > 2 ? ' y otros' : ''}`;

        // 3. Ejecutar Commit
        execSync(`git commit -m "${mensajeCommit}"`);

        // 4. Obtener Meta-datos finales
        const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
        const autor = execSync('git log -1 --format="%an <%ae>"', { encoding: 'utf-8' }).trim();

        // 5. Registrar en Bitácora con el nuevo formato
        await registrarEnBitacora({
            hash: commitHash,
            autor: autor,
            mensaje: mensajeCommit,
            explicacion: explicacionNarrativa,
            archivos: stagingFiles
        });

        return { success: true, data: { hash: commitHash, mensaje: mensajeCommit } };
    } catch (error) {
        return { success: false, error: error.message };
    }
};