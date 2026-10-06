import { normalizePoints } from './math';

export type Point = { x: number; y: number };

// Very basic gesture recognizer
export const recognizeGesture = (points: Point[]): { gesture: string, confidence: number } | null => {
  if (points.length < 10) return null;
  
  const normalized = normalizePoints(points);
  const start = normalized[0];
  const end = normalized[normalized.length - 1];
  
  // Calculate bounding box and distances
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let pathLength = 0;
  
  for (let i = 0; i < normalized.length; i++) {
    const p = normalized[i];
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
    
    if (i > 0) {
      const prev = normalized[i-1];
      pathLength += Math.sqrt(Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2));
    }
  }
  
  const width = maxX - minX;
  const height = maxY - minY;
  const distanceStartEnd = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  
  // Circle detection: start and end are close, path length is roughly Pi * diameter
  // Bounding box should be roughly square
  const isBoxSquare = Math.abs(width - height) < 0.4;
  if (distanceStartEnd < 0.3 && isBoxSquare && pathLength > 2.5 && pathLength < 4.5) {
    return { gesture: 'CIRCLE', confidence: 0.85 + Math.random() * 0.1 };
  }
  
  // Line detection: straight line, distance start-end is close to path length
  if (Math.abs(pathLength - distanceStartEnd) < 0.2 && pathLength > 0.5) {
    return { gesture: 'LINE', confidence: 0.9 + Math.random() * 0.05 };
  }
  
  // Triangle detection: roughly closed, 3 distinct corners... simplistic check
  // Checking for sharp direction changes could improve this. 
  // Let's use a simpler heuristic for a triangle: closed shape, path length is ~3 times side
  if (distanceStartEnd < 0.3 && pathLength > 2.0 && pathLength <= 3.5 && isBoxSquare) {
     return { gesture: 'TRIANGLE', confidence: 0.78 + Math.random() * 0.1 };
  }
  
  // Spiral detection: path length is very long, but fits in a bounding box, ends inside
  if (pathLength > 4.5 && distanceStartEnd > 0.2) {
    return { gesture: 'SPIRAL', confidence: 0.82 + Math.random() * 0.1 };
  }
  
  return null;
};
