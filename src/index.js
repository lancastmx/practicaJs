import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

// Cambiamos el objeto {} por un Array []
const lecciones = [
    { id: "01", ruta: "./lecciones/01-vars.js" },
    { id: "07", ruta: "./lecciones/07-log.js" },
    { id: "08", ruta: "./lecciones/08-if-else.js" },
    { id: "09", ruta: "./lecciones/09-switch.js" },
    { id: "10", ruta: "./lecciones/10-for-while.js" },
    { id: "11", ruta: "./lecciones/11-function.js" },
    { id: "12", ruta: "./lecciones/12-scope.js" },
    { id: "13", ruta: "./lecciones/13-closure.js" },
    { id: "salir", ruta: null }
];

async function iniciarLaboratorio() {
    let continuar = true;

    while (continuar) {
        console.clear();
        console.log("--- 🎓 ACADEMIA JS: MENÚ PRINCIPAL ---");

        // Ahora recorremos el array, el orden está garantizado
        lecciones.forEach(l => {
            console.log(`[${l.id}] - ${l.ruta || 'Cerrar programa'}`);
        });

        const seleccion = await rl.question("\n¿Qué lección quieres estudiar? (o escribe 'salir'): ");

        if (seleccion.toLowerCase() === 'salir') {
            continuar = false;
            console.log("¡Sigue practicando! Hasta pronto.");
            break;
        }

        // Buscamos la lección dentro del array
        const leccionEncontrada = lecciones.find(l => l.id === seleccion);
        const archivo = leccionEncontrada ? leccionEncontrada.ruta : null;

        if (archivo) {
            // ... (resto de tu lógica de importación se mantiene igual)
            let repetirLeccion = true;
            while (repetirLeccion) {
                console.log(`\n📖 Iniciando: ${archivo}\n------------------`);
                const timestamp = Date.now();
                await import(`${archivo}?update=${timestamp}`);
                const respuesta = await rl.question("\n¿Quieres repetir esta lección? (s/n): ");
                if (respuesta.toLowerCase() !== 's') repetirLeccion = false;
            }
        } else {
            console.log("⚠️ Opción no válida. Intenta de nuevo.");
            await rl.question("\nPresiona Enter para continuar...");
        }
    }
    rl.close();
}

iniciarLaboratorio();