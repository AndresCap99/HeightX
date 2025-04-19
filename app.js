
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#simple").innerHTML = `
        <h2>Lanzamiento Simple</h2>
        <p>Ingresa velocidad inicial para simular el lanzamiento.</p>
        <input type="number" id="velocidadInicial" placeholder="Velocidad inicial (m/s)">
        <button onclick="calcularAltura()">Calcular altura</button>
        <div id="resultadoSimple"></div>
    `;

    document.querySelector("#comparar").innerHTML = `
        <h2>Comparar Lanzamientos</h2>
        <p>Compara dos lanzamientos diferentes con sus propios parámetros.</p>
        <input type="number" id="vel1" placeholder="Velocidad 1 (m/s)">
        <input type="number" id="vel2" placeholder="Velocidad 2 (m/s)">
        <button onclick="compararLanzamientos()">Comparar</button>
        <div id="resultadoComparacion"></div>
    `;

    document.querySelector("#gravedad").innerHTML = `
        <h2>Gravedad Personalizada</h2>
        <p>Ingresa un valor de gravedad para usar en los cálculos.</p>
        <input type="number" id="gravedad" placeholder="Gravedad (m/s²)" step="0.01">
        <button onclick="guardarGravedad()">Guardar gravedad</button>
        <div id="resultadoGravedad"></div>
    `;

    document.querySelector("#forma").innerHTML = `
        <h2>Forma del Objeto</h2>
        <p>Selecciona la forma del objeto para afectar los cálculos.</p>
        <select id="formaObjeto">
            <option value="esfera">Esfera</option>
            <option value="cubo">Cubo</option>
            <option value="cilindro">Cilindro</option>
        </select>
        <button onclick="guardarForma()">Guardar forma</button>
        <div id="resultadoForma"></div>
    `;

    document.querySelector("#inverso").innerHTML = `
        <h2>Cálculo Inverso por Altura</h2>
        <p>Ingresa la altura que quieres alcanzar y se calculará la velocidad necesaria.</p>
        <input type="number" id="alturaDeseada" placeholder="Altura (m)">
        <button onclick="calculoInverso()">Calcular velocidad</button>
        <div id="resultadoInverso"></div>
    `;

    document.querySelector("#historial").innerHTML = `
        <h2>Historial de Lanzamientos</h2>
        <div id="listaHistorial"></div>
    `;

    cargarHistorial();
});

// Variables globales
let gravedadPersonalizada = 9.81;
let formaActual = "esfera";

// Funciones
function calcularAltura() {
    const v = parseFloat(document.getElementById("velocidadInicial").value);
    const g = gravedadPersonalizada;
    if (!isNaN(v)) {
        const altura = (v * v) / (2 * g);
        document.getElementById("resultadoSimple").innerText = `Altura máxima: ${altura.toFixed(2)} m`;
        guardarEnHistorial("Simple", { v, altura });
    }
}

function compararLanzamientos() {
    const v1 = parseFloat(document.getElementById("vel1").value);
    const v2 = parseFloat(document.getElementById("vel2").value);
    const g = gravedadPersonalizada;
    if (!isNaN(v1) && !isNaN(v2)) {
        const h1 = (v1 * v1) / (2 * g);
        const h2 = (v2 * v2) / (2 * g);
        document.getElementById("resultadoComparacion").innerText =
            `Lanzamiento 1: ${h1.toFixed(2)} m | Lanzamiento 2: ${h2.toFixed(2)} m`;
        guardarEnHistorial("Comparación", { v1, v2, h1, h2 });
    }
}

function guardarGravedad() {
    const g = parseFloat(document.getElementById("gravedad").value);
    if (!isNaN(g)) {
        gravedadPersonalizada = g;
        document.getElementById("resultadoGravedad").innerText = `Gravedad actual: ${g} m/s²`;
    }
}

function guardarForma() {
    const forma = document.getElementById("formaObjeto").value;
    formaActual = forma;
    document.getElementById("resultadoForma").innerText = `Forma seleccionada: ${forma}`;
}

function calculoInverso() {
    const h = parseFloat(document.getElementById("alturaDeseada").value);
    const g = gravedadPersonalizada;
    if (!isNaN(h)) {
        const velocidad = Math.sqrt(2 * g * h);
        document.getElementById("resultadoInverso").innerText = `Velocidad necesaria: ${velocidad.toFixed(2)} m/s`;
        guardarEnHistorial("Inverso", { h, velocidad });
    }
}

function guardarEnHistorial(tipo, datos) {
    const historial = JSON.parse(localStorage.getItem("historialHeightX") || "[]");
    historial.push({ tipo, datos, fecha: new Date().toLocaleString() });
    localStorage.setItem("historialHeightX", JSON.stringify(historial));
    cargarHistorial();
}

function cargarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historialHeightX") || "[]");
    const lista = historial.map(item => 
        `<div class='card'><b>${item.tipo}</b><br>${JSON.stringify(item.datos)}<br><small>${item.fecha}</small></div>`
    ).join("");
    document.getElementById("listaHistorial").innerHTML = lista || "<p>No hay lanzamientos registrados.</p>";
}
