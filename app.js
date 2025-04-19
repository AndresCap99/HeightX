
document.getElementById("air").addEventListener("change", function () {
  const extraInputs = document.getElementById("extraInputs");
  extraInputs.style.display = this.checked ? "block" : "none";
});

function calculateHeight() {
  const t = parseFloat(document.getElementById("time").value);
  const d = parseFloat(document.getElementById("diameter").value) / 2;
  const m = parseFloat(document.getElementById("mass").value);
  const useAir = document.getElementById("air").checked;
  const g = 9.81;
  let result = document.getElementById("result");

  if (isNaN(t) || t <= 0) {
    result.textContent = "Please enter a valid time.";
    return;
  }

  if (!useAir) {
    const h = 0.5 * g * t * t;
    result.textContent = `Height: ${h.toFixed(2)} m`;
    return;
  }

  if (isNaN(d) || isNaN(m) || d <= 0 || m <= 0) {
    result.textContent = "Enter valid mass and diameter.";
    return;
  }

  const Cd = 0.47;
  const rho = 1.225;
  const A = Math.PI * d * d;
  const dt = 0.01;
  let v = 0, h = 0, timeSim = 0;

  while (timeSim < t) {
    const Fg = m * g;
    const Fd = 0.5 * Cd * rho * A * v * v;
    const Fnet = Fg - Fd;
    const a = Fnet / m;
    v += a * dt;
    h += v * dt;
    timeSim += dt;
  }

  result.textContent = `Height: ${h.toFixed(2)} m`;
}
