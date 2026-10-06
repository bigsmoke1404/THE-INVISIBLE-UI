export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
};

export const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

// Normalize points to a 0-1 bounding box
export const normalizePoints = (points: {x: number, y: number}[]) => {
  if (points.length === 0) return [];
  
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });
  
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const scale = Math.max(width, height);
  
  return points.map(p => ({
    x: (p.x - minX) / scale,
    y: (p.y - minY) / scale
  }));
};
