// Dot-matrix world map rasterised from coarse continent polygons (no external assets).
type Pt = [number, number]; // [lon, lat]

const LAND: Pt[][] = [
  // North & Central America
  [[-168,66],[-160,71],[-140,70],[-120,72],[-95,73],[-80,70],[-62,60],[-55,50],[-66,44],[-76,35],[-81,25],[-97,26],[-97,18],[-87,15],[-83,9],[-78,8],[-90,14],[-105,20],[-112,30],[-118,33],[-124,40],[-125,49],[-135,58],[-150,60],[-165,60]],
  // Greenland
  [[-55,60],[-45,60],[-20,70],[-20,82],[-60,82],[-72,77],[-55,70]],
  // South America
  [[-78,8],[-72,12],[-62,10],[-50,0],[-35,-6],[-38,-15],[-48,-26],[-58,-38],[-66,-46],[-70,-55],[-75,-50],[-73,-38],[-71,-20],[-81,-5],[-80,2]],
  // Eurasia
  [[-10,36],[-9,43],[-1,46],[-5,48],[5,52],[10,56],[5,62],[15,69],[30,71],[60,70],[80,73],[110,77],[140,73],[170,70],[180,66],[165,60],[155,58],[142,52],[135,43],[128,38],[122,40],[121,31],[120,24],[110,20],[108,12],[105,9],[100,13],[99,8],[103,1],[98,8],[94,17],[88,22],[80,15],[77,8],[72,20],[67,25],[57,25],[57,22],[52,17],[43,12],[35,28],[34,31],[27,37],[26,40],[18,40],[16,38],[12,44],[6,43],[3,42],[-5,36]],
  // Africa
  [[-17,21],[-10,35],[10,37],[32,31],[35,27],[43,12],[51,12],[40,-5],[40,-15],[35,-25],[27,-34],[18,-34],[12,-18],[9,-1],[9,4],[-8,4],[-17,14]],
  // Australia
  [[114,-22],[122,-17],[131,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[140,-38],[131,-31],[115,-34]],
  // UK & Ireland
  [[-6,50],[1,51],[2,55],[-2,59],[-6,57],[-5,54]],
  // Japan
  [[130,32],[135,34],[141,38],[142,44],[140,42],[133,35]],
  // Indonesia / Borneo / Madagascar
  [[95,5],[105,-6],[106,-6],[98,2]],
  [[106,-6],[115,-8],[115,-7]],
  [[109,2],[118,7],[118,-1],[110,-3]],
  [[44,-25],[50,-15],[49,-12],[44,-17]],
];

const W = 1000;
const LAT_TOP = 78;
const LAT_BOT = -58;
const H = Math.round((W * (LAT_TOP - LAT_BOT)) / 360);
const proj = ([lon, lat]: Pt): Pt => [((lon + 180) / 360) * W, ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * H];

function inside(pt: Pt, poly: Pt[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function dotsPath() {
  const step = 3.2;
  let d = "";
  for (let lat = LAT_TOP; lat > LAT_BOT; lat -= step) {
    for (let lon = -180; lon < 180; lon += step) {
      if (LAND.some((poly) => inside([lon, lat], poly))) {
        const [x, y] = proj([lon, lat]);
        d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
      }
    }
  }
  return d;
}

const HUB: { name: string; at: Pt } = { name: "Dubai hub", at: [55.3, 25.2] };
const DEST: { name: string; at: Pt }[] = [
  { name: "London", at: [-0.1, 51.5] },
  { name: "New York", at: [-74, 40.7] },
  { name: "Los Angeles", at: [-118.2, 34] },
  { name: "São Paulo", at: [-46.6, -23.5] },
  { name: "Lagos", at: [3.4, 6.5] },
  { name: "Johannesburg", at: [28, -26.2] },
  { name: "Istanbul", at: [29, 41] },
  { name: "Mumbai", at: [72.8, 19] },
  { name: "Singapore", at: [103.8, 1.3] },
  { name: "Tokyo", at: [139.7, 35.7] },
  { name: "Sydney", at: [151.2, -33.9] },
  { name: "Berlin", at: [13.4, 52.5] },
];

const LAND_D = dotsPath();

export function WorldMap({ className = "" }: { className?: string }) {
  const [hx, hy] = proj(HUB.at);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="World map showing our shipping routes from the Dubai hub to major destinations">
      <path d={LAND_D} stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity="0.32" />
      {DEST.map((d, i) => {
        const [x, y] = proj(d.at);
        const mx = (hx + x) / 2;
        const my = Math.min(hy, y) - Math.abs(hx - x) * 0.16 - 18;
        return (
          <g key={d.name}>
            <path d={`M${hx} ${hy}Q${mx} ${my} ${x} ${y}`} className="arc" fill="none" stroke="var(--accent)" strokeWidth="1.4" style={{ animationDelay: `${i * 0.35}s` }} />
            <circle cx={x} cy={y} r="4" fill="var(--accent)" />
            <text x={x + 8} y={y + 4} fontSize="12" fontWeight="600" fill="currentColor" opacity="0.85">{d.name}</text>
          </g>
        );
      })}
      <circle cx={hx} cy={hy} r="7" className="pulse-ring" fill="var(--accent)" />
      <circle cx={hx} cy={hy} r="7" fill="var(--accent)" />
      <circle cx={hx} cy={hy} r="2.6" fill="var(--accent-ink)" />
    </svg>
  );
}
