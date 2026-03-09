import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', '.agent', 'coverage'];
const ALLOWED_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.md', '.html', '.css', '.txt'];

async function searchTodos(dir) {
    let results = [];
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const dirent of files) {
        const fullPath = path.join(dir, dirent.name);

        if (dirent.isDirectory()) {
            if (!IGNORED_DIRS.includes(dirent.name)) {
                results = results.concat(await searchTodos(fullPath));
            }
        } else if (dirent.isFile()) {
            if (['BuscadorTodosSkill.js', 'test-BuscadorTodos.js', 'TODOS.md'].includes(dirent.name)) {
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
        const todos = await searchTodos(searchPath);

        return { success: true, count: todos.length, data: todos };
    } catch (error) {
        return { success: false, error: error.message };
    }
};