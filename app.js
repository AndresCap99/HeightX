
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

function compararLanzamientos(v1, v2) {
  const g = gravedadPersonalizada;
  return { h1: (v1 * v1) / (2 * g), h2: (v2 * v2) / (2 * g) };
}

function setGravedad(valor) {
  gravedadPersonalizada = parseFloat(valor);
}

function setForma(forma) {
  formaSeleccionada = forma;
  const cd = coeficientesForma[forma] || 0.47;
  document.getElementById("cd")?.value = cd;
}

function calcularVelocidadParaAltura(h) {
  return Math.sqrt(2 * gravedadPersonalizada * h);
}

function guardarEnHistorial(item) {
  const historial = JSON.parse(localStorage.getItem("heightx_historial") || "[]");
  historial.push({ ...item, fecha: new Date().toLocaleString() });
  localStorage.setItem("heightx_historial", JSON.stringify(historial));
}

function obtenerHistorial() {
  return JSON.parse(localStorage.getItem("heightx_historial") || "[]");
}

function mostrarHistorialEnElemento(idElemento) {
  const historial = obtenerHistorial();
  const contenedor = document.getElementById(idElemento);
  contenedor.innerHTML = historial.reverse().map(item => 
    `<div><b>${item.tipo}</b> – ${item.fecha}<br>${JSON.stringify(item.datos)}</div>`
  ).join('') || "<p>No hay historial aún.</p>";
}
