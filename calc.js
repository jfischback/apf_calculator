// Required APF calculation. APFs are from OSHA 29 CFR 1910.134(d)(3)(i)(A), Table 1.
// Blank or invalid inputs are represented as "".

const APF_TABLE = [
  { name: "APR, quarter mask", apf: 5 },
  { name: "APR, half mask (incl. filtering facepiece)", apf: 10 },
  { name: "APR, full facepiece", apf: 50 },
  { name: "PAPR, half mask", apf: 50 },
  { name: "PAPR, full facepiece", apf: 1000 },
  { name: "PAPR, helmet/hood (WPF/SWPF ≥ 1,000)", apf: 1000 },
  { name: "PAPR, helmet/hood (no WPF/SWPF test)", apf: 25 },
  { name: "PAPR, loose-fitting facepiece", apf: 25 },
  { name: "SAR demand, half mask", apf: 10 },
  { name: "SAR demand, full facepiece", apf: 50 },
  { name: "SAR continuous flow, half mask", apf: 50 },
  { name: "SAR continuous flow, full facepiece", apf: 1000 },
  { name: "SAR continuous flow, helmet/hood (WPF/SWPF ≥ 1,000)", apf: 1000 },
  { name: "SAR continuous flow, helmet/hood (no WPF/SWPF test)", apf: 25 },
  { name: "SAR continuous flow, loose-fitting facepiece", apf: 25 },
  { name: "SAR pressure-demand, half mask", apf: 50 },
  { name: "SAR pressure-demand, full facepiece", apf: 1000 },
  { name: "SCBA demand, half mask", apf: 10 },
  { name: "SCBA demand, full facepiece", apf: 50 },
  { name: "SCBA demand, helmet/hood", apf: 50 },
  { name: "SCBA pressure-demand, full facepiece", apf: 10000 },
  { name: "SCBA pressure-demand, helmet/hood", apf: 10000 },
];

// Distinct APF values in Table 1, smallest first: 5, 10, 25, 50, 1000, 10000.
const APF_LEVELS = [...new Set(APF_TABLE.map((r) => r.apf))].sort((a, b) => a - b);

// Keeps JS float noise out of comparisons (e.g. 0.30000000000000004 -> 0.3).
function clean(x) {
  return Number(x.toPrecision(15));
}

const NOTES = {
  IDLH: "Exposure is at or above the IDLH. Use only respirators allowed by 1910.134(d)(2).",
  PASS: "The selected respirator's APF meets or exceeds the hazard ratio.",
  FAIL: "The selected respirator's APF is below the hazard ratio.",
};

function calculate(i) {
  const exposure = i.exposure;
  const oel = i.oel;
  const idlh = i.idlh;
  const row = APF_TABLE.find((r) => r.name === i.respirator);

  // Hazard ratio (minimum APF needed) = exposure / OEL
  const hazardRatio = exposure === "" || oel === "" ? "" : clean(exposure / oel);

  // Smallest Table 1 APF >= hazard ratio
  let lowestApf = "";
  if (hazardRatio !== "") lowestApf = hazardRatio > 10000 ? "None in Table 1" : APF_LEVELS.find((a) => a >= hazardRatio);

  const selectedApf = row ? row.apf : "";

  let result;
  if (hazardRatio === "" || selectedApf === "") result = "Enter inputs";
  else if (idlh !== "" && exposure >= idlh) result = "IDLH";
  else if (selectedApf >= hazardRatio) result = "PASS";
  else result = "FAIL";

  return { hazardRatio, lowestApf, selectedApf, result, note: NOTES[result] || "" };
}

if (typeof module !== "undefined") module.exports = { calculate, APF_TABLE, APF_LEVELS };
