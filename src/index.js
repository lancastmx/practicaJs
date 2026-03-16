import readline from 'readline/promises'; // Versión moderna para usar await
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

const lecciones = {
    "01": "./lecciones/01-vars.js",
    "07": "./lecciones/07-log.js",
    "08": "./lecciones/08-if-else.js",
    "09": "./lecciones/09-switch.js",
    "10": "./lecciones/10-for-while.js",
    "salir": null
};

async function iniciarLaboratorio() {
    let continuar = true;

    while (continuar) {
        console.clear(); // Limpia la consola para que se vea ordenado
        console.log("--- 🎓 ACADEMIA JS: MENÚ PRINCIPAL ---");
        Object.keys(lecciones).forEach(key => console.log(`[${key}] - ${lecciones[key] || 'Cerrar programa'}`));

        const seleccion = await rl.question("\n¿Qué lección quieres estudiar? (o escribe 'salir'): ");

        if (seleccion.toLowerCase() === 'salir') {
            continuar = false;
            console.log("¡Sigue practicando! Hasta pronto.");
            break;
        }

        const archivo = lecciones[seleccion];

        if (archivo) {
            let repetirLeccion = true;
            while (repetirLeccion) {
                console.log(`\n📖 Iniciando: ${archivo}\n------------------`);

                // Limpiamos el cache para que si cambias el código, se vea el cambio
                const timestamp = Date.now();
                await import(`${archivo}?update=${timestamp}`);

                const respuesta = await rl.question("\n¿Quieres repetir esta lección? (s/n): ");
                if (respuesta.toLowerCase() !== 's') {
                    repetirLeccion = false;
                }
            }
        } else {
            console.log("⚠️ Opción no válida. Intenta de nuevo.");
            await rl.question("\nPresiona Enter para continuar...");
        }
    }
    rl.close();
}

iniciarLaboratorio();