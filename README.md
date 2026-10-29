# OEMS Required APF Calculator

Calculates the hazard ratio (exposure ÷ OEL), which is the minimum APF needed, and checks the selected respirator against its OSHA 29 CFR 1910.134 Table 1 APF.

Plain HTML, CSS, and JavaScript with no build step. To deploy on Vercel, import the repo and leave the framework preset as "Other".

- `index.html`: the page
- `calc.js`: the calculation logic and the Table 1 APF list
- `app.js`: connects the form to the calculation
- `style.css`: the styles (from the OEMS Noise Reduction Calculator, plus the dropdown and table styles from the Enclosure Ventilation Calculator)
- `tests/check.js`: test cases, run with `node tests/check.js`
