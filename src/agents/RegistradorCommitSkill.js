import { exec } from 'child_process';
import { promisify } from 'util';
import { appendFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export const run = async (p = {}) => {
    try {
        const bitacoraPath = path.join(process.cwd(), 'BITACORA.md');
        const logFormat = "%an <%ae>%n%ad%n%B";

        // MODO REESCRITURA TOTAL
        if (p.forceRewrite) {
            // Obtenemos todos los commits
            const { stdout } = await execAsync(`git log --format="${logFormat}" --date=format:"%Y-%m-%d %H:%M:%S"`);
            const rawCommits = stdout.trim().split(/\n(?=[^\n]+ <[^\n]+>\n\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\n)/);

            let nuevaBitacora = "# Bitácora de Commits\n\n";

            for (const c of rawCommits) {
                const lines = c.trim().split('\n');
                if (lines.length >= 3) {
                    const autor = lines[0];
                    const fecha = lines[1];
                    const mensaje = lines.slice(2).join('\n').trim();
                    nuevaBitacora += `## [${fecha}] | Autor: ${autor} | Mensaje: ${mensaje}\n\n`;
                }
            }

            await fs.promises.writeFile(bitacoraPath, nuevaBitacora, 'utf8');
            return {
                success: true,
                data: { message: "Bitácora reescrita por completo exitosamente.", file: bitacoraPath }
            };
        }

        // MODO INCREMENTAL
        // 1. Obtener el último commit
        const { stdout } = await execAsync(`git log -1 --format="${logFormat}" --date=format:"%Y-%m-%d %H:%M:%S"`);
        const lines = stdout.trim().split('\n');

        if (lines.length < 3) {
            return { success: false, error: "No commit message found." };
        }

        const autor = lines[0];
        const fecha = lines[1];
        const mensaje = lines.slice(2).join('\n').trim();
        const nuevaEntrada = `## [${fecha}] | Autor: ${autor} | Mensaje: ${mensaje}\n\n`;

        // 2. Comprobar si ya existe
        let bitacoraContent = '';
        if (fs.existsSync(bitacoraPath)) {
            bitacoraContent = await fs.promises.readFile(bitacoraPath, 'utf8');
        }

        if (bitacoraContent.includes(`## [${fecha}]`)) {
            return {
                success: true,
                data: { message: "No hay commits nuevos para registrar.", file: bitacoraPath }
            };
        }

        // 3. Agregar el nuevo commit
        await appendFile(bitacoraPath, nuevaEntrada, 'utf8');

        return {
            success: true,
            data: {
                message: `Commit de ${autor} registrado de forma incremental.`,
                commitInfo: { autor, fecha, mensaje },
                file: bitacoraPath
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};