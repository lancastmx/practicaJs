import fs from 'fs';
import path from 'path';

export const run = async (payload) => {
    // El payload debe traer el nombre del archivo, ej: { archivo: 'prueba.txt' }
    const fileName = payload?.archivo || 'prueba.txt';
    const filePath = path.join(process.cwd(), fileName);

    try {
        if (!fs.existsSync(filePath)) {
            return { success: false, error: `El archivo ${fileName} no existe.` };
        }

        const data = fs.readFileSync(filePath, 'utf8');
        console.log(`--- Contenido de ${fileName} ---`);
        console.log(data);

        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};