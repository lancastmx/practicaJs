import fs from 'fs';
import path from 'path';

export const run = async (data) => {
    const bitacoraPath = path.join(process.cwd(), 'BITACORA.md');
    const fecha = new Date().toLocaleString();

    // Si es una reconstrucción (forceRewrite)
    if (data.forceRewrite) {
        // Aquí podrías implementar un loop que lea el git log y use este formato
        return { success: true, data: "Limpieza solicitada" };
    }

    const bloque = `
## 🛠️ [ID: ${data.hash}] | ${fecha}
- **Autor:** ${data.autor}
- **Mensaje:** ${data.mensaje}
- **Explicación:** - ${data.explicacion}
- **Archivos afectados:** ${data.archivos.join(', ')}

---`;

    if (!fs.existsSync(bitacoraPath)) {
        fs.writeFileSync(bitacoraPath, "# 📓 BITÁCORA DE INGENIERÍA\n");
    }

    const contenidoActual = fs.readFileSync(bitacoraPath, 'utf-8');
    // Insertar después del título para mantener lo nuevo arriba
    const nuevoContenido = contenidoActual.replace("# 📓 BITÁCORA DE INGENIERÍA\n", "# 📓 BITÁCORA DE INGENIERÍA\n" + bloque);

    fs.writeFileSync(bitacoraPath, nuevoContenido);
    return { success: true };
};