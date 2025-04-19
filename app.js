
document.getElementById("airResistanceToggle").addEventListener("change", function () {
  document.getElementById("extraInputs").style.display = this.checked ? "block" : "none";
});

function calculateHeight() {
  const g = 9.81;
  const t = parseFloat(document.getElementById("timeInput").value);
  const useAir = document.getElementById("airResistanceToggle").checked;

  if (isNaN(t) || t <= 0) {
    document.getElementById("result").innerText = "⛔ Ingresa un tiempo válido.";
    return;
  }

  if (!useAir) {
    const h = 0.5 * g * t * t;
    document.getElementById("result").innerText = `📐 Altura (sin resistencia): ${h.toFixed(2)} m`;
    return;
  }

  const d = parseFloat(document.getElementById("diameterInput").value) / 2;
  const m = parseFloat(document.getElementById("massInput").value);
  if (isNaN(d) || isNaN(m) || d <= 0 || m <= 0) {
    document.getElementById("result").innerText = "⚠️ Ingresa masa y diámetro válidos.";
    return;
  }

  const Cd = 0.47;
  const rho = 1.225;
  const A = Math.PI * d * d;
  const dt = 0.01;
  let v = 0;
  let h = 0;
  let timeSim = 0;

  while (timeSim < t) {
    const Fg = m * g;
    const Fd = 0.5 * Cd * rho * A * v * v;
    const Fnet = Fg - Fd;
    const a = Fnet / m;
    v += a * dt;
    h += v * dt;
    timeSim += dt;
  }

  document.getElementById("result").innerText = `🌬️ Altura (con aire): ${h.toFixed(2)} m`;
}
