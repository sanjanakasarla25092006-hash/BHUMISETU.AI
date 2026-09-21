const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];
const optionsHtml = `<option value="All">All States</option>\n` + STATES.map(s => `        <option value="${s}">${s}</option>`).join('\n');

const rxSelectRegex = /<select id="rx-state"[\s\S]*?<\/select>/;
const newRxSelect = `<select id="rx-state" class="search-input" style="max-width:200px;" onchange="bindResearchSearch()">
${optionsHtml}
      </select>`;
code = code.replace(rxSelectRegex, newRxSelect);

const dsSelectRegex = /<select id="ds-state"[\s\S]*?<\/select>/;
const newDsSelect = `<select id="ds-state" class="search-input" style="max-width:200px;" onchange="bindDatasetSearch()">
${optionsHtml}
      </select>`;
code = code.replace(dsSelectRegex, newDsSelect);

fs.writeFileSync('index-4.html', code, 'utf8');
