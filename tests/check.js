// Run with: node tests/check.js
const assert = require("assert");
const { calculate } = require("../calc.js");

const half = "APR, half mask (incl. filtering facepiece)";
const cases = [
  [{ exposure: 50, oel: 10, idlh: "", respirator: half }, { hazardRatio: 5, lowestApf: 5, selectedApf: 10, result: "PASS" }],
  [{ exposure: 600, oel: 10, idlh: "", respirator: half }, { hazardRatio: 60, lowestApf: 1000, selectedApf: 10, result: "FAIL" }],
  [{ exposure: 1500, oel: 10, idlh: 1200, respirator: "SCBA pressure-demand, full facepiece" }, { hazardRatio: 150, result: "IDLH" }],
  [{ exposure: 200001, oel: 20, idlh: "", respirator: half }, { lowestApf: "None in Table 1", result: "FAIL" }],
  [{ exposure: "", oel: 10, idlh: "", respirator: half }, { hazardRatio: "", lowestApf: "", result: "Enter inputs", note: "" }],
  [{ exposure: 50, oel: 10, idlh: "", respirator: "" }, { selectedApf: "", result: "Enter inputs" }],
];

for (const [input, expected] of cases) {
  const r = calculate(input);
  for (const k of Object.keys(expected)) assert.strictEqual(r[k], expected[k], `${JSON.stringify(input)} ${k}`);
  console.log("ok", JSON.stringify(input), "->", r.hazardRatio, r.lowestApf, r.selectedApf, r.result);
}
