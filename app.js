document.getElementById("air").addEventListener("change", function () {
  document.getElementById("extraInputs").style.display = this.checked ? "block" : "none";
});
document.getElementById("expertMode").addEventListener("change", function () {
  document.getElementById("expertInputs").style.display = this.checked ? "block" : "none";
});

function calculateHeight() {
  const t = parseFloat(document.getElementById("time").value);
  const d = parseFloat(document.getElementById("diameter").value) / 2;
  const m = parseFloat(document.getElementById("mass").value);
  const Cd = parseFloat(document.getElementById("cd").value) || 0.47;
  const useAir = document.getElementById("air").checked;
  const expertMode = document.getElementById("expertMode").checked;
  const g = 9.81;
  const result = document.getElementById("result");
  const expertOutput = document.getElementById("expertOutput");

  if (isNaN(t) || t <= 0) {
    result.textContent = "Enter a valid time.";
    return;
  }

  let finalVelocity = 0;
  let finalAcceleration = g;

  if (!useAir) {
    const h = 0.5 * g * t * t;
    finalVelocity = g * t;
    result.textContent = `Height: ${h.toFixed(2)} m`;
    if (expertMode) {
      expertOutput.style.display = "block";
      expertOutput.textContent = `Final Speed: ${finalVelocity.toFixed(2)} m/s | Final Acceleration: ${g.toFixed(2)} m/s²`;
    } else {
      expertOutput.style.display = "none";
    }
    addToHistory(t, null, null, h, useAir, expertMode, finalVelocity, g, Cd);
    return;
  }

  if (isNaN(d) || isNaN(m) || d <= 0 || m <= 0) {
    result.textContent = "Enter valid mass and diameter.";
    return;
  }

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
    finalAcceleration = a;
  }

  finalVelocity = v;
  result.textContent = `Height (with air): ${h.toFixed(2)} m`;
  if (expertMode) {
    expertOutput.style.display = "block";
    expertOutput.textContent = `Final Speed: ${finalVelocity.toFixed(2)} m/s | Final Acceleration: ${finalAcceleration.toFixed(2)} m/s² | Cd: ${Cd}`;
  } else {
    expertOutput.style.display = "none";
  }

  addToHistory(t, d * 2, m, h, useAir, expertMode, finalVelocity, finalAcceleration, Cd);
}

function addToHistory(t, d, m, h, air, expert, v, a, Cd) {
  const li = document.createElement("li");
  li.textContent = `⏱ ${t}s | ${air ? "🌬️ Air" : "🆗 No Air"} | H: ${h.toFixed(2)} m` +
    (expert ? ` | V: ${v.toFixed(2)} m/s | A: ${a.toFixed(2)} m/s² | Cd: ${Cd}` : "");
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