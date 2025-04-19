
function calculateHeight() {
  const g = 9.81; // gravedad m/s^2
  const t = parseFloat(document.getElementById("timeInput").value);
  if (isNaN(t) || t <= 0) {
    document.getElementById("result").innerText = "Ingresa un tiempo válido";
    return;
  }
  const h = 0.5 * g * t * t;
  document.getElementById("result").innerText = `Altura estimada: ${h.toFixed(2)} metros`;
}
