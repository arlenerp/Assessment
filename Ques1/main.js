// Referred https://www.w3schools.com/tags/ref_canvas.asp

// Canvas Setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Polygons to be centered
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const gap = 140; 
const size = 80;

const shapes = [
  // Triangle
  [
    {x: cx - gap - size, y: cy - gap - size/2},
    {x: cx - gap + size/2, y: cy - gap + size},
    {x: cx - gap - size*2, y: cy - gap + size}
  ],
  // Square 
  [
    {x: cx + gap - size, y: cy - gap - size/2},
    {x: cx + gap + size, y: cy - gap - size/2},
    {x: cx + gap + size, y: cy - gap + size*1.5},
    {x: cx + gap - size, y: cy - gap + size*1.5}
  ],
  // Pentagon
  [
    {x: cx - gap - size*1.5, y: cy + gap - size/2},
    {x: cx - gap - size/2,   y: cy + gap - size},
    {x: cx - gap + size/2,   y: cy + gap},
    {x: cx - gap - size/2,   y: cy + gap + size},
    {x: cx - gap - size*1.7, y: cy + gap + size/2}
  ],
  // Concave Arrow 
  [
    {x: cx + gap - size,   y: cy + gap - size/2},
    {x: cx + gap + size,   y: cy + gap - size/2},
    {x: cx + gap + size,   y: cy + gap + size*1.5},
    {x: cx + gap,          y: cy + gap + size/2},
    {x: cx + gap - size,   y: cy + gap + size*1.5}
  ]
];

// Inital Mouse Point
let mouse = { x: 0, y: 0 };
document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});


// Point-in-polygon (ray casting)
function pointInPolygon(poly, p) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Closest point on segment
function closestPointOnSegment(a, b, p) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const abLen2 = abx * abx + aby * aby;

  let t = (apx * abx + apy * aby) / abLen2;
  t = Math.max(0, Math.min(1, t));

  return { x: a.x + t * abx, y: a.y + t * aby };
}

// Closest point inside polygon
function closestPointInPolygon(poly, pos) {
  if (pointInPolygon(poly, pos)) return pos;

  let closest = null;
  let minDist = Infinity;

  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const cp = closestPointOnSegment(a, b, pos);
    const dx = cp.x - pos.x;
    const dy = cp.y - pos.y;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < minDist) {
      minDist = dist2;
      closest = cp;
    }
  }
  return closest;
}

function drawPolygon(poly) {
  ctx.beginPath();
  ctx.moveTo(poly[0].x, poly[0].y);
  for (let i = 1; i < poly.length; i++) 
	ctx.lineTo(poly[i].x, poly[i].y);
	ctx.closePath();
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1.5;
	ctx.stroke();
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  shapes.forEach(poly => {
    drawPolygon(poly);

    const inside = pointInPolygon(poly, mouse);
    if (!inside) {
      const cp = closestPointInPolygon(poly, mouse);
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(cp.x, cp.y);
      ctx.stroke();

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
  ctx.strokeStyle = "white";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  requestAnimationFrame(draw);
}

draw();