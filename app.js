
document.getElementById("air").addEventListener("change", function () {
  document.getElementById("extraInputs").style.display = this.checked ? "block" : "none";
});
document.getElementById("expertMode").addEventListener("change", function () {
  document.getElementById("expertInputs").style.display = this.checked ? "block" : "none";
});

let chart;
let historyVisible = false;

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
  let chartTimes = [];
  let chartHeights = [];

  let now = new Date().toLocaleString();

  if (!useAir) {
    const h = 0.5 * g * t * t;
    finalVelocity = g * t;
    result.textContent = `Height: ${h.toFixed(2)} m`;
    if (expertMode) {
      expertOutput.style.display = "block";
      expertOutput.textContent = `Final Speed: ${finalVelocity.toFixed(2)} m/s | Final Acceleration: ${g.toFixed(2)} m/s²`;
      for (let timeSim = 0; timeSim <= t; timeSim += 0.1) {
        chartTimes.push(timeSim.toFixed(2));
        chartHeights.push(0.5 * g * timeSim * timeSim);
      }
      renderChart(chartTimes, chartHeights);
    } else {
      expertOutput.style.display = "none";
      if (chart) chart.destroy();
    }
    saveHistory(`📅 ${formatDate(now)} |⏱ ${t}s | No Air | ${h.toFixed(2)} m`);
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

    if (expertMode && timeSim % 0.1 < dt) {
      chartTimes.push(timeSim.toFixed(2));
      chartHeights.push(h);
    }
  }

  finalVelocity = v;
  result.textContent = `Height (with air): ${h.toFixed(2)} m`;
  if (expertMode) {
    expertOutput.style.display = "block";
    expertOutput.textContent = `Final Speed: ${finalVelocity.toFixed(2)} m/s | Final Acceleration: ${finalAcceleration.toFixed(2)} m/s² | Cd: ${Cd}`;
    renderChart(chartTimes, chartHeights);
  } else {
    expertOutput.style.display = "none";
    if (chart) chart.destroy();
  }

  saveHistory(`📅 ${formatDate(now)} |⏱ ${t}s | Air | ${h.toFixed(2)} m`);
}

function renderChart(times, heights) {
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'Height vs Time',
        data: heights,
        borderColor: 'rgba(139, 195, 74, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: 'Time (s)' } },
        y: { title: { display: true, text: 'Height (m)' } }
      }
    }
  });
}

function saveHistory(entry) {
  const history = JSON.parse(localStorage.getItem("heightx_history") || "[]");
  history.unshift(entry);
  localStorage.setItem("heightx_history", JSON.stringify(history));
  if (historyVisible) renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("heightx_history") || "[]");
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function toggleHistory() {
  const section = document.getElementById("history");
  historyVisible = !historyVisible;
  if (historyVisible) {
    renderHistory();
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}


function formatDate(full) {
  const date = new Date(full);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} | ${date.toTimeString().split(" ")[0]}`;
}

function exportResults() {

  const history = JSON.parse(localStorage.getItem("heightx_history") || "[]");
  let text = history.map((item, i) => `${i + 1}. ${item}`).join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "heightx_history.txt";
  link.click();
}
