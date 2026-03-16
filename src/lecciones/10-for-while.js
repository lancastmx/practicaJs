import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Función que genera un sonido real usando el sistema operativo
 * Windows: Usa un comando de PowerShell para emitir una frecuencia.
 * Mac: Usa el sonido de sistema "Hero".
 */
async function sonar(frecuencia = 440, duracion = 200) {
    try {
        if (process.platform === 'win32') {
            // Comando mágico de PowerShell: [console]::beep(frecuencia, duracion)
            await execAsync(`powershell.exe -Command "[console]::beep(${frecuencia}, ${duracion})"`);
        } else if (process.platform === 'darwin') {
            // En Mac usamos un sonido de sistema
            await execAsync(`afplay /System/Library/Sounds/Hero.aiff`);
        } else {
            // Linux (requiere beep instalado, si no, solo el texto)
            process.stdout.write('\u0007');
        }
    } catch (e) {
        // Si falla el sonido, al menos avisamos en consola
        console.log("🔊 (Sonido no disponible)");
    }
}

async function ejecutarLeccion() {
    console.clear();
    console.log("🎹 LABORATORIO DE SONIDO REAL");
    console.log("==============================\n");

    // --- 1. EL BUCLE FOR (LA ESCALA) ---
    console.log("🎵 1. BUCLE 'FOR': Una escala que sube.");

    const notas = [261, 329, 392, 523]; // Do, Mi, Sol, Do (Acorde)

    for (let i = 0; i < notas.length; i++) {
        process.stdout.write(`   🎶 Nota ${i + 1}: ${notas[i]}Hz... `);
        await sonar(notas[i], 300); // Tocamos la nota
        console.log("♪");
        await new Promise(r => setTimeout(r, 100)); // Pausa entre notas
    }

    console.log("\n✅ El FOR terminó la secuencia.");
    console.log("-------------------------------\n");

    // --- 2. EL BUCLE WHILE (EL ACELERADOR) ---
    console.log("🥁 2. BUCLE 'WHILE': Ritmo que se acelera.");

    let tiempo = 500; // Empezamos lento
    let activo = true;
    let vueltas = 0;

    while (activo) {
        vueltas++;
        process.stdout.write(`   🥁 PULSO ${vueltas} (Esperando ${tiempo}ms)... `);

        await sonar(150, 100); // Un sonido más grave para el ritmo
        console.log("¡BOM!");

        await new Promise(r => setTimeout(r, tiempo));

        // El WHILE cambia su propia condición
        tiempo -= 100; // Cada vez más rápido

        if (tiempo <= 0) {
            console.log("\n⚠️ ¡Demasiado rápido! Deteniendo...");
            activo = false;
        }
    }

    console.log("\n🛑 El WHILE se detuvo cuando el tiempo llegó a 0.");
}

// --- 3. EL BUCLE FOR OF (LA LISTA) ---
async function ejecutaRun() {
    console.log("🎵 3. BUCLE 'FOR OF': Recorrer una lista.");
    const frutas = ["manzana", "banana", "uva", "pera"];
    for (const fruta of frutas) {
        console.log("En la lista encontramos:", fruta);
        if (fruta === "uva") {
            console.log("¡Encontré una uva!");
            break;
        }
    }
    console.log("Fin del bucle.");

}

// --- 4. EL BUCLE FOR IN (EL INDICE) ---
console.log("🎵 4. BUCLE 'FOR IN': Recorrer un objeto.");
const persona = { nombre: "Juan", edad: 30, ciudad: "Madrid" };
for (const clave in persona) {
    console.log(`${clave}: ${persona[clave]}`);
}
console.log("Fin del bucle.");

// --- 5. EL BUCLE FOR EACH (EL INDICE) ---
console.log("🎵 5. BUCLE 'FOR EACH': Recorrer una lista.");
const frutas2 = ["manzana", "banana", "uva", "pera"];
frutas2.forEach((fruta, indice) => {
    console.log(`${indice}: ${fruta}`);
});
console.log("Fin del bucle.");

await ejecutarLeccion();
await ejecutaRun();
