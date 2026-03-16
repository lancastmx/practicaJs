import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export const run = async (data = {}) => {
    const bitacoraPath = path.join(process.cwd(), 'BITACORA.md');
    const tituloPrincipal = "# 📓 BITÁCORA DE INGENIERÍA\n\n";

    // ── Modo reconstrucción total ──────────────────────────────────────────
    if (data.forceRewrite) {
        let nuevoContenido = tituloPrincipal;
        try {
            const logOut = execSync('git log --pretty=format:"%h|%an <%ae>|%ad|%s" --date=iso', { encoding: 'utf-8' });
            if (logOut) {
                for (const commitLine of logOut.split('\n')) {
                    const partes = commitLine.split('|');
                    if (partes.length < 4) continue;
                    const [hash, autor, fechaStr, mensaje] = partes;
                    const fecha = new Date(fechaStr).toLocaleString();
                    let archivos = [];
                    try {
                        const filesOut = execSync(`git show --name-only --format=tformat: ${hash} --`, { encoding: 'utf-8' });
                        archivos = filesOut.split('\n').filter(Boolean);
                    } catch (e) { }

                    nuevoContenido += _bloque(hash, autor, fecha, mensaje, archivos);
                }
            }
            fs.writeFileSync(bitacoraPath, nuevoContenido);
            return { success: true, data: "Historial regenerado" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ── Modo inserción atómica ─────────────────────────────────────────────
    try {
        const hash   = data.hash   || execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
        const autor  = data.autor  || execSync('git config user.name',        { encoding: 'utf-8' }).trim();
        const fecha  = new Date().toLocaleString();

        // Captura el mensaje completo del último commit, íntegro, sin alterar
        const mensajeCompleto = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim();

        const listaArchivos = (data.archivos && data.archivos.length)
            ? data.archivos.join(', ')
            : 'Ninguno';

        const bloque = _bloque(hash, autor, fecha, mensajeCompleto, listaArchivos);

        // Inyectar justo debajo del título principal
        let contenidoActual = fs.existsSync(bitacoraPath)
            ? fs.readFileSync(bitacoraPath, 'utf-8')
            : tituloPrincipal;

        if (!contenidoActual.startsWith("# 📓 BITÁCORA DE INGENIERÍA")) {
            contenidoActual = contenidoActual.replace(/^# Bitácora de Commits/, "# 📓 BITÁCORA DE INGENIERÍA");
            if (!contenidoActual.startsWith("# 📓 BITÁCORA DE INGENIERÍA")) {
                contenidoActual = tituloPrincipal + contenidoActual;
            }
        }

        const nuevoContenido = contenidoActual.replace(
            /# 📓 BITÁCORA DE INGENIERÍA\n*/,
            tituloPrincipal + bloque
        );

        fs.writeFileSync(bitacoraPath, nuevoContenido);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Construye el bloque de bitácora con el mensaje de commit íntegro
 * como blockquote markdown (> ), preservando multilínea y título.
 */
function _bloque(hash, autor, fecha, mensajeCompleto, archivos) {
    // Convierte cada línea del mensaje en una línea de blockquote
    const blockquote = mensajeCompleto
        .split('\n')
        .map(linea => `> ${linea}`)
        .join('\n');

    const listaArchivos = Array.isArray(archivos) ? archivos.join(', ') : archivos;

    return `## 🛠️ [ID: ${hash}] | ${fecha}
- **Autor:** ${autor}
- **Cambios Técnicos:**
${blockquote}
- **Archivos:** ${listaArchivos}

---
`;
}