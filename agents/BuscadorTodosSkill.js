import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', '.agent', 'coverage'];
const ALLOWED_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.md', '.html', '.css', '.txt'];

// Función para obtener exclusiones dinámicas desde la documentación
async function getDynamicExclusions() {
    let excludes = ['TODOS.md'];
    try {
        const __filename = fileURLToPath(import.meta.url);
        const mdPath = path.join(path.dirname(__filename), '../.agent/skills/BuscadorTodos.md');
        if (fs.existsSync(mdPath)) {
            const mdContent = await fs.promises.readFile(mdPath, 'utf8');
            const filesSection = mdContent.match(/## 📂 Archivos y Activos([^#]+)/);
            if (filesSection) {
                // Regex para extraer todos los paths tipo `src/...` o `.agent/...`
                const paths = filesSection[1].match(/[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*/g);
                if (paths) {
                    paths.forEach(p => {
                        const fileBase = path.basename(p);
                        if (!excludes.includes(fileBase)) excludes.push(fileBase);
                    });
                }
            }
        }
    } catch (e) {
        console.error("No se pudo cargar la exclusión dinámica", e.message);
    }
    return excludes;
}

async function searchTodos(dir, excludedFiles) {
    let results = [];
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const dirent of files) {
        const fullPath = path.join(dir, dirent.name);

        if (dirent.isDirectory()) {
            if (!IGNORED_DIRS.includes(dirent.name)) {
                results = results.concat(await searchTodos(fullPath, excludedFiles));
            }
        } else if (dirent.isFile()) {
            if (excludedFiles.includes(dirent.name)) {
                continue;
            }
            const ext = path.extname(dirent.name).toLowerCase();
            if (ALLOWED_EXTS.includes(ext) || ext === '') {
                try {
                    const content = await fs.promises.readFile(fullPath, 'utf8');
                    const lines = content.split(/\r?\n/);
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes('TODO')) {
                            results.push({
                                file: path.relative(process.cwd(), fullPath),
                                line: i + 1,
                                text: lines[i].trim()
                            });
                        }
                    }
                } catch (err) {
                    // Ignore errors reading file
                }
            }
        }
    }
    return results;
}

export const run = async (payload) => {
    try {
        const cwd = process.cwd();
        const searchPath = payload?.path ? path.resolve(cwd, payload.path) : cwd;

        const excludedFiles = await getDynamicExclusions();
        const todos = await searchTodos(searchPath, excludedFiles);

        // Guardar en TODOS.md en la ruta destino y avisar si no es escribible
        const pTodos = path.join(cwd, 'TODOS.md');
        try {
            const outputLines = ['# Registro de TODOS\n'];
            todos.forEach(t => outputLines.push(`- **${t.file}:${t.line}** - ${t.text}`));
            if (todos.length === 0) outputLines.push('_No se encontraron tareas pendientes (TODO)._');

            await fs.promises.writeFile(pTodos, outputLines.join('\n'), 'utf8');
        } catch (writeErr) {
            return { success: false, error: `Error Crítico: El archivo de destino TODOS.md no es escribible o no existe. (${writeErr.message})` };
        }

        return { success: true, count: todos.length, data: "Resultados guardados en TODOS.md" };
    } catch (error) {
        return { success: false, error: error.message };
    }
};