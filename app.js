
document.getElementById("air").addEventListener("change", function () {
  document.getElementById("extraInputs").style.display = this.checked ? "block" : "none";
});

function calculateHeight() {
  const t = parseFloat(document.getElementById("time").value);
  const d = parseFloat(document.getElementById("diameter").value) / 2;
  const m = parseFloat(document.getElementById("mass").value);
  const useAir = document.getElementById("air").checked;
  const expertMode = document.getElementById("expertMode").checked;
  const g = 9.81;
  let result = document.getElementById("result");

  if (isNaN(t) || t <= 0) {
    result.textContent = "Enter a valid time.";
    return;
  }

  if (!useAir) {
    const h = 0.5 * g * t * t;
    const msg = `Height: ${h.toFixed(2)} m`;
    result.textContent = msg;
    addToHistory(t, null, null, h, useAir, expertMode);
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

  const msg = `Height (with air): ${h.toFixed(2)} m`;
  result.textContent = msg;
  addToHistory(t, d * 2, m, h, useAir, expertMode);
}

function addToHistory(t, d, m, h, air, expert) {
  const li = document.createElement("li");
  li.textContent = `⏱ ${t}s | ${air ? "🌬️ Air" : "🆗 No Air"} | Height: ${h.toFixed(2)} m${expert ? " ⚙️" : ""}`;
  document.getElementById("history").prepend(li);
  if (document.getElementById("history").children.length > 20) {
    document.getElementById("history").removeChild(document.getElementById("history").lastChild);
  }
}

function exportResults() {
  let text = "";
  const items = document.querySelectorAll("#history li");
  items.forEach((item, i) => {
    text += `${i + 1}. ${item.textContent}\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "heightx_history.txt";
  link.click();
}
