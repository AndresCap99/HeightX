
let gravedadPersonalizada = 9.81;
let formaSeleccionada = "esfera";
const coeficientesForma = { esfera: 0.47, cubo: 1.05, cilindro: 0.82 };

function calculateHeight() {
  const t = parseFloat(document.getElementById("time").value);
  const g = gravedadPersonalizada;
  const h = 0.5 * g * t * t;
  document.getElementById("output").innerText = `Height: ${h.toFixed(2)} m`;
  guardarEnHistorial({ tipo: "Cálculo", datos: { tiempo: t, altura: h } });
}

function comparar() {
  const v1 = parseFloat(document.getElementById("vComp1").value);
  const v2 = parseFloat(document.getElementById("vComp2").value);
  const g = gravedadPersonalizada;
  const h1 = (v1 * v1) / (2 * g);
  const h2 = (v2 * v2) / (2 * g);
  document.getElementById("outComp").innerText = `Altura 1: ${h1.toFixed(2)} m | Altura 2: ${h2.toFixed(2)} m`;
  guardarEnHistorial({ tipo: "Comparación", datos: { v1, v2, h1, h2 } });
}

function aplicarGravedad() {
  const g = parseFloat(document.getElementById("customG").value);
  gravedadPersonalizada = g;
  document.getElementById("outGrav").innerText = `Gravedad actual: ${g} m/s²`;
}

function setForma(forma) {
  formaSeleccionada = forma;
}

function calcularInverso() {
  const h = parseFloat(document.getElementById("hDeseada").value);
  const v = Math.sqrt(2 * gravedadPersonalizada * h);
  document.getElementById("outInverso").innerText = `Velocidad necesaria: ${v.toFixed(2)} m/s`;
  guardarEnHistorial({ tipo: "Inverso", datos: { altura: h, velocidad: v } });
}

function guardarEnHistorial(item) {
  const historial = JSON.parse(localStorage.getItem("heightx_historial") || "[]");
  historial.push({ ...item, fecha: new Date().toLocaleString() });
  localStorage.setItem("heightx_historial", JSON.stringify(historial));
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem("heightx_historial") || "[]").reverse();
  const container = document.getElementById("historialCompleto");
  container.innerHTML = historial.length
    ? historial.map(item => `<div><b>${item.tipo}</b> - ${item.fecha}<br>${JSON.stringify(item.datos)}</div>`).join('<hr>')
    : "<p>No hay historial todavía.</p>";
}
