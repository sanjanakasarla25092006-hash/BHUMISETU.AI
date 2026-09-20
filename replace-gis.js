const fs = require('fs');
let code = fs.readFileSync('index-4.html', 'utf8');

// Replace gisSection
const gisRegex = /function gisSection\(\)\{[\s\S]*?\}\s*function gisStateGrid/;
const newGis = `function gisSection(){
  return \`
  <div class="page-head">
    <div class="kicker">GIS EXPLORER</div>
    <h1>Geospatial Intelligence Map</h1>
    <p>High-resolution interactive map powered by Leaflet.js. Explore geospatial intelligence layers.</p>
  </div>
  <div class="search-row" style="background:#fff; border:1px solid var(--line); border-radius:8px; padding:16px; margin-bottom:24px; display:flex; gap:12px;">
    <input class="search-input" type="text" id="gis-search" placeholder="Search state or region..." style="flex:1;">
    <select id="gis-layer-select" style="padding:10px 14px; border:1px solid var(--line); border-radius:6px; outline:none; font-size:14px; background:#fff;">
       <option value="osm">Standard Map</option>
       <option value="topo">Topographic</option>
       <option value="satellite">Satellite Imagery</option>
    </select>
    <button class="btn btn-navy" onclick="toast('Searching region...')">Locate</button>
  </div>
  <div class="gis-layout" style="display:block;">
    <div style="width:100%; height:500px; border-radius:12px; overflow:hidden; border:1px solid var(--line); box-shadow:0 4px 12px rgba(0,0,0,0.05); position:relative;">
       <div id="gis-map" style="width:100%; height:100%; z-index:1;"></div>
    </div>
  </div>\`;
}
function gisStateGrid`;
code = code.replace(gisRegex, newGis);

// Replace bindGis
const bindRegex = /function bindGis\(\)\{[\s\S]*?\}\s*function bindCaseSearch/;
const newBind = `function bindGis(){
  const mapEl = document.getElementById('gis-map');
  if(!mapEl) return;
  if(window.currentMap) { window.currentMap.remove(); window.currentMap = null; }
  
  // Initialize Leaflet map centered on India
  const map = L.map('gis-map').setView([20.5937, 78.9629], 5);
  window.currentMap = map;
  
  // Layer groups
  const layers = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap' }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' })
  };
  
  layers.osm.addTo(map); // Default layer
  
  // Add some mock markers for demonstration
  const markers = [
    { loc: [28.6139, 77.2090], title: 'Delhi - Urban Expansion Zone' },
    { loc: [19.0760, 72.8777], title: 'Mumbai - Coastal Zone Regulation' },
    { loc: [17.3850, 78.4867], title: 'Hyderabad - Dharani Digitization Hub' },
    { loc: [13.0827, 80.2707], title: 'Chennai - Flood Risk Assessment' },
    { loc: [25.5941, 85.1376], title: 'Patna - Agricultural Land Survey' }
  ];
  
  markers.forEach(m => {
    L.marker(m.loc).addTo(map).bindPopup('<b>' + m.title + '</b><br>Geospatial analysis available.');
  });
  
  // Handle layer switching
  const select = document.getElementById('gis-layer-select');
  if(select) {
    select.addEventListener('change', (e) => {
      // Remove all layers
      Object.values(layers).forEach(l => map.removeLayer(l));
      // Add selected layer
      if(layers[e.target.value]) layers[e.target.value].addTo(map);
    });
  }
}
function bindCaseSearch`;
code = code.replace(bindRegex, newBind);

fs.writeFileSync('index-4.html', code, 'utf8');
