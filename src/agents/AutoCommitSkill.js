// v1.1 - Soporte para mensajes en lenguaje natural.
import { exec } from 'child_process';
import { promisify } from 'util';
import { run as runRegistrador } from './RegistradorCommitSkill.js';

const execAsync = promisify(exec);

export const run = async (p = {}) => {
    try {
        console.log("Iniciando AutoCommitSkill...");

        // 1. Añadir cambios
        console.log("Ejecutando `git add .`...");
        await execAsync('git add .');

        // 2. Obtener estado
        const { stdout: diffOut } = await execAsync('git diff --cached --name-only');
        const archivos = diffOut.trim().split('\n').filter(Boolean);

        if (archivos.length === 0) {
            throw new Error("No se puede hacer commit: no hay archivos en el área de staging.");
        }

        // 3. Análisis Real de Contenido
        const { stdout: diffUnified } = await execAsync('git diff --cached --unified=0');
        const lineasAgregadas = diffUnified.split('\n').filter(line => line.startsWith('+') && !line.startsWith('+++'));

        // Heurística de Descripción
        let descripcionAccion = "";
        let tipo = "update";

        // Prioridad 1: console.log
        if (lineasAgregadas.some(line => line.includes('console.log'))) {
            descripcionAccion = "Añade logs de depuración";
            tipo = "chore";
        }
        // Prioridad 2: export const (nueva función)
        else if (lineasAgregadas.some(line => line.includes('export const'))) {
            const match = lineasAgregadas.find(line => line.includes('export const')).match(/export const\s+(\w+)/);
            const funcName = match ? match[1] : 'indefinida';
            descripcionAccion = `Añade funcionalidad ${funcName}`;
            tipo = "feat";
        }
        // Prioridad 3: Cambios en .md
        else if (archivos.some(a => a.endsWith('.md'))) {
            const mdFiles = archivos.filter(a => a.endsWith('.md')).map(a => a.split('/').pop());
            const filesStr = mdFiles.length > 1 ? "varios archivos" : mdFiles[0];
            descripcionAccion = `Actualiza documentación de ${filesStr}`;
            tipo = "docs";
        }
        // Fallback: Prohibición de Genéricos
        else {
            throw new Error("No se pudo determinar el cambio: el contenido no coincide con las heurísticas conocidas (logs, nueva función, o documentación).");
        }

        // 4. Formato de Salida
        const archivosNombres = archivos.map(f => f.split('/').pop());
        const maxFiles = 3;
        let listaNombres = archivosNombres.slice(0, maxFiles).join(', ');
        if (archivosNombres.length > maxFiles) {
            listaNombres += ` y ${archivosNombres.length - maxFiles} más`;
        }

        let mensajeGenerado = `${tipo}: ${descripcionAccion} en [${listaNombres}]`;

        console.log("Mensaje de commit generado:");
        console.log(mensajeGenerado);

        // 5. Hacer commit
        console.log("Ejecutando `git commit`...");
        const mensajeSeguro = mensajeGenerado.replace(/"/g, '\\"');
        await execAsync(`git commit -m "${mensajeSeguro}"`);

        console.log("Commit realizado. Registrando bitácora...");

        // 5. Invocar obligatoriamente RegistradorCommitSkill
        const registroResultado = await runRegistrador({ forceRewrite: p.forceRewrite || false });

        return {
            success: true,
            data: {
                mensajeGenerado,
                registro: registroResultado
            }
        };
    } catch (error) {
        console.error("Error en AutoCommitSkill:", error);
        return { success: false, error: error.message };
    }
};