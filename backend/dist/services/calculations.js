"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularPromedioDesdeNotas = void 0;
const calcularPromedioDesdeNotas = (notas) => {
    let promedio = 0;
    notas.forEach((n) => {
        promedio += n.nota * (n.porcentaje / 100);
    });
    return Math.round(promedio * 100) / 100;
};
exports.calcularPromedioDesdeNotas = calcularPromedioDesdeNotas;
//# sourceMappingURL=calculations.js.map