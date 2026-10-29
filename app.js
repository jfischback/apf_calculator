const form = document.getElementById("form");
const $ = (id) => document.getElementById(id);

// Number inputs: blank or not greater than 0 is treated as blank.
function num(id) {
  const raw = $(id).value.trim();
  if (raw === "") return "";
  const v = Number(raw);
  return Number.isFinite(v) && v > 0 ? v : "";
}

function fmt(value) {
  return typeof value === "number" ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : value;
}

// Fill the respirator dropdown and the APF table from APF_TABLE.
for (const r of APF_TABLE) {
  $("respirator").add(new Option(r.name, r.name));
  const tr = document.createElement("tr");
  tr.dataset.name = r.name;
  tr.innerHTML = "<td></td><td class=\"apf\"></td>";
  tr.cells[0].textContent = r.name;
  tr.cells[1].textContent = fmt(r.apf);
  $("apfRows").append(tr);
}

function update() {
  const units = $("units").value;
  document.querySelectorAll("[data-unit]").forEach((el) => (el.textContent = units));

  const respirator = $("respirator").value;
  const r = calculate({ exposure: num("exposure"), oel: num("oel"), idlh: num("idlh"), respirator });

  const contaminant = $("contaminant").value.trim();
  $("sub").textContent = (contaminant ? contaminant + " · " : "") + "Minimum APF needed = exposure ÷ OEL";

  const hr = $("hazardRatio");
  hr.textContent = r.hazardRatio === "" ? "Enter exposure and OEL" : fmt(r.hazardRatio);
  hr.parentElement.classList.toggle("text", r.hazardRatio === "");

  $("lowestApf").textContent = fmt(r.lowestApf);
  $("lowestApf").classList.toggle("text", typeof r.lowestApf !== "number");
  $("selectedApf").textContent = r.selectedApf === "" ? "Select respirator" : fmt(r.selectedApf);
  $("selectedApf").classList.toggle("text", r.selectedApf === "");
  $("result").textContent = r.result;
  $("note").textContent = r.note;

  const pill = $("pill");
  const done = r.result !== "Enter inputs";
  pill.textContent = done ? r.result : "";
  pill.className = "pill" + (done ? " " + r.result.toLowerCase() : "");

  document.querySelectorAll("#apfRows tr").forEach((tr) => tr.classList.toggle("current", tr.dataset.name === respirator));
}

form.addEventListener("input", update);
form.addEventListener("change", update);
update();
