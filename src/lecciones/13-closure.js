// Ejemplo de closure
function crearContador() {
    let contador = 0;
    return function () {
        contador++;
        return contador;
    };
}
const contador = crearContador();
console.log(contador()); // 1
console.log(contador()); // 2
console.log(contador()); // 3

// Ejemplo de closure con variables externas

function crearCajaDeAhorro(saldoInicial) {
    let saldo = saldoInicial;
    return {
        depositar(monto) {
            saldo += monto;
            return `Depósito de $${monto}. Saldo actual: $${saldo}`;
        },
        retirar(monto) {
            if (monto > saldo) {
                return "Fondos insuficientes";
            }
            saldo -= monto;
            return `Retiro de $${monto}. Saldo actual: $${saldo}`;
        },
        consultarSaldo() {
            return `Saldo actual: $${saldo}`;
        }
    }

}

const miCajaDeAhorro = crearCajaDeAhorro(1000);
console.log(miCajaDeAhorro.consultarSaldo());
console.log(miCajaDeAhorro.depositar(500));
console.log(miCajaDeAhorro.retirar(200));
console.log(miCajaDeAhorro.retirar(2000));

function crearGastoPersonal(saldoLibre) {
    let saldo = saldoLibre; // Este es nuestro "estado" privado

    return {
        // Dividimos el saldo actual entre los 15 días
        obtenerPresupuestoDiario() {
            let diario = saldo / 15;
            return `Tienes $${diario.toFixed(2)} para gastar por día.`;
        },

        // Por si quieres ir restando lo que ya gastaste
        registrarGasto(monto) {
            saldo -= monto;
            return `Gastaste $${monto}. Saldo restante: $${saldo.toFixed(2)}`;
        }
    };
}

// Cómo usarlo:
const misFinanzas = crearGastoPersonal(3000);
console.log(misFinanzas.obtenerPresupuestoDiario()); // "Tienes $200.00 para gastar por día."