function Point(x, y) { return { x, y }; }

function printResult(name, got, expected) {
  const dx = got.x - expected.x;
  const dy = got.y - expected.y;
  const ok = Math.sqrt(dx*dx + dy*dy) < 1e-6;
  console.log(`${ok ? 'CORRECT' : 'INCORRECT'} ${name}`);
  console.log(`   got: (${got.x.toFixed(2)}, ${got.y.toFixed(2)})`);
  console.log(`   expected: (${expected.x.toFixed(2)}, ${expected.y.toFixed(2)})`);
}

// Square: (0,0)-(1,1)
const square = [
  Point(0,0), Point(1,0), Point(1,1), Point(0,1)
];

// Concave L
const concave = [
  Point(0,0), Point(2,0), Point(2,1),
  Point(1,1), Point(1,2), Point(0,2)
];

// 4 TEST CASES
printResult("Inside square, same point", closestPointInPolygon(square, Point(0.5, 0.5)), Point(0.5, 0.5));
printResult("Outside near vertex (below bottom-left)", closestPointInPolygon(square, Point(-0.3, -0.2)), Point(0, 0));
printResult("Outside near right edge", closestPointInPolygon(square, Point(1.4, 0.5)), Point(1, 0.5));
printResult("Concave L, inner elbow", closestPointInPolygon(concave, Point(1.5, 1.5)), Point(1, 1.5));
