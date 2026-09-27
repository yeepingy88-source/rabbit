export const PATH = 0, SOFT = 1, STONE = 2, EXIT = 3;
export const TILE = { PATH: 0, SOFT: 1, STONE: 2, WALL: 2, EXIT: 3 };
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** BFS distance map from (sx,sy) over PATH cells */
function bfsDist(grid, W, H, sx, sy) {
  const dist = Array.from({ length: H }, () => Array(W).fill(-1));
  const q = [[sx, sy]];
  dist[sy][sx] = 0;
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (grid[ny][nx] !== PATH && grid[ny][nx] !== EXIT) continue;
      if (dist[ny][nx] >= 0) continue;
      dist[ny][nx] = dist[y][x] + 1;
      q.push([nx, ny]);
    }
  }
  return dist;
}

/**
 * Recursive-backtracker maze with:
 * - deeper branching (prefer unexplored neighbors randomly)
 * - random start & far exit
 * - solid outer border (no edge soft walls → no "hug the wall" dig-through)
 */
export function createLevel(level) {
  // Sizing by level tier:
  // Levels 1-5: 15x15 (Spacious starting cavern, ample branches)
  // Levels 6-10: 21x21 (Deep winding labyrinth)
  // Levels 11-15: 27x27 (Vast subterranean network)
  // Levels 16-20: 33x33 (Epic mega abyss)
  // Levels 21+ (Endless): 35x35+
  let dim = 15;
  if (level >= 21) dim = Math.min(35 + Math.floor((level - 21) / 5) * 2, 45);
  else if (level >= 16) dim = 33;
  else if (level >= 11) dim = 27;
  else if (level >= 6) dim = 21;
  else dim = 15;

  const W = dim, H = dim;
  const cw = (W - 1) / 2;
  const ch = (H - 1) / 2;
  const tier = Math.min(4, Math.floor((level - 1) / 5));
  const grid = Array.from({ length: H }, () => Array(W).fill(STONE));
  const seen = Array.from({ length: ch }, () => Array(cw).fill(false));

  // True recursive DFS — long corridors & real dead-ends
  const carve = (cx, cy) => {
    seen[cy][cx] = true;
    grid[cy * 2 + 1][cx * 2 + 1] = PATH;
    for (const [dx, dy] of shuffle(DIRS.slice())) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= cw || ny >= ch || seen[ny][nx]) continue;
      // knock down wall between cells
      grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = PATH;
      carve(nx, ny);
    }
  };
  // Random DFS seed for layout variety
  carve(Math.floor(Math.random() * cw), Math.floor(Math.random() * ch));

  // Soft diggable walls ONLY deep inside (never on outer two rings)
  // → prevents "dig along the edge" shortcuts
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      if (grid[y][x] !== STONE) continue;
      // only wall cells between corridors (odd/even mix)
      if (x % 2 === y % 2) continue;
      // fewer soft walls early, more later — still sparse for challenge
      const softChance = 0.28 + tier * 0.04;
      if (Math.random() < softChance) grid[y][x] = SOFT;
    }
  }

  // Collect interior PATH cells
  const paths = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] === PATH) paths.push([x, y]);
    }
  }

  // Enforce strict distance check:
  // 1. Manhattan distance >= 70% of total maze dimension
  // 2. The exit can NEVER be in the same quadrant or adjacent to start
  const midX = (W - 1) / 2;
  const midY = (H - 1) / 2;
  const maxPossibleSpan = (W - 3) + (H - 3);
  const minRequiredMDist = Math.max(8, Math.floor(0.70 * maxPossibleSpan));

  const getQuadrant = (x, y) => `${x < midX ? -1 : 1},${y < midY ? -1 : 1}`;

  const validPairs = [];
  for (let i = 0; i < paths.length; i++) {
    const p1 = paths[i];
    const q1 = getQuadrant(p1[0], p1[1]);
    for (let j = i + 1; j < paths.length; j++) {
      const p2 = paths[j];
      const q2 = getQuadrant(p2[0], p2[1]);
      if (q1 === q2) continue; // NEVER in the same quadrant

      const mDist = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
      if (mDist < minRequiredMDist) continue; // MUST be >= 70% of total dimension

      validPairs.push({ p1, p2, mDist });
    }
  }

  let sx, sy, ex, ey;
  if (validPairs.length > 0) {
    shuffle(validPairs);
    validPairs.sort((a, b) => b.mDist - a.mDist);
    // Select from top 25% farthest opposite-quadrant pairs
    const topCandidates = validPairs.slice(0, Math.max(1, Math.floor(validPairs.length * 0.25)));
    const chosen = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    if (Math.random() < 0.5) {
      [sx, sy] = chosen.p1;
      [ex, ey] = chosen.p2;
    } else {
      [sx, sy] = chosen.p2;
      [ex, ey] = chosen.p1;
    }
  } else {
    // Fail-safe opposite corners if ever needed
    sx = 1; sy = 1;
    ex = W - 2; ey = H - 2;
  }

  const dist = bfsDist(grid, W, H, sx, sy);

  // Place EXIT; keep outer border STONE except the exit cell itself
  grid[ey][ex] = EXIT;
  for (let x = 0; x < W; x++) {
    if (grid[0][x] !== EXIT) grid[0][x] = STONE;
    if (grid[H - 1][x] !== EXIT) grid[H - 1][x] = STONE;
  }
  for (let y = 0; y < H; y++) {
    if (grid[y][0] !== EXIT) grid[y][0] = STONE;
    if (grid[y][W - 1] !== EXIT) grid[y][W - 1] = STONE;
  }

  const start = { x: sx, y: sy }, exit = { x: ex, y: ey };

  // Landmark: PATH nearest center, not start/exit
  let landmark = null;
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] !== PATH) continue;
      if ((x === sx && y === sy) || (x === ex && y === ey)) continue;
      const d = Math.abs(x - (W - 1) / 2) + Math.abs(y - (H - 1) / 2);
      if (!landmark || d < landmark.d) landmark = { x, y, d };
    }
  if (!landmark) landmark = { x: sx, y: sy, d: 0 };

  // Detect dead ends (corridors with only 1 open direction)
  const deadEnds = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (grid[y][x] !== PATH) continue;
      if ((x === sx && y === sy) || (x === ex && y === ey)) continue;
      let openCount = 0;
      for (const [dx, dy] of DIRS) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < W && ny < H) {
          if (grid[ny][nx] === PATH || grid[ny][nx] === EXIT) {
            openCount++;
          }
        }
      }
      if (openCount === 1) {
        deadEnds.push({ x, y, dist: dist[y][x] });
      }
    }
  }
  deadEnds.sort((a, b) => b.dist - a.dist);

  // Drastic Item Reduction (>= 75% clean empty paths)
  let nCarrots = 1;
  let nDroplets = 1;
  let maxMaterials = 1;

  if (level <= 5) {
    nCarrots = 1;
    nDroplets = 1;
    maxMaterials = 1;
  } else if (level <= 10) {
    nCarrots = 1;
    nDroplets = 2;
    maxMaterials = 1;
  } else if (level <= 15) {
    nCarrots = 2;
    nDroplets = 2;
    maxMaterials = 2;
  } else {
    nCarrots = 2;
    nDroplets = 3;
    maxMaterials = 2;
  }

  const spots = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const farThreshold = W <= 15 ? 3 : 4;
      const far = (p) => Math.abs(p.x - x) + Math.abs(p.y - y) >= farThreshold;
      if (
        grid[y][x] === PATH &&
        !(x === landmark.x && y === landmark.y) &&
        far(start) &&
        far(exit)
      ) {
        spots.push([x, y]);
      }
    }
  }
  shuffle(spots);

  // 1. Carrots
  const carrots = spots.splice(0, nCarrots).map(([x, y]) => ({ x, y, taken: false }));

  // 2. Water Droplets
  const droplets = spots.splice(0, nDroplets).map(([x, y]) => ({
    x,
    y,
    type: 'water',
    ox: (Math.random() - 0.5) * 0.4,
    oy: (Math.random() - 0.5) * 0.4,
    taken: false,
  }));

  // 3. Crafting Materials (Strictly limited across the entire level)
  const materials = [];
  let matBudget = maxMaterials;

  // Shard in a deep dead-end if budget allows
  if (matBudget > 0 && deadEnds.length > 0 && (Math.random() < 0.4 || level >= 6)) {
    const shardSpot = deadEnds[0];
    if (
      !(shardSpot.x === start.x && shardSpot.y === start.y) &&
      !(shardSpot.x === exit.x && shardSpot.y === exit.y) &&
      !(shardSpot.x === landmark.x && shardSpot.y === landmark.y)
    ) {
      materials.push({
        x: shardSpot.x,
        y: shardSpot.y,
        type: 'shard',
        ox: 0,
        oy: 0,
        taken: false,
      });
      matBudget--;
    }
  }

  // Fill remaining material budget from available spots
  const matTypes = ['fiber', 'clay'];
  while (matBudget > 0 && spots.length > 0) {
    const [x, y] = spots.splice(0, 1)[0];
    const type = matTypes[Math.floor(Math.random() * matTypes.length)];
    materials.push({
      x,
      y,
      type,
      ox: (Math.random() - 0.5) * 0.4,
      oy: (Math.random() - 0.5) * 0.4,
      taken: false,
    });
    matBudget--;
  }

  // Spawn 2 to 3 Cave Beetles when level >= 40
  const beetles = [];
  if (level >= 40) {
    const numBeetles = level >= 45 ? 3 : 2;
    const corridors = [];

    // Horizontal straight corridors of PATH cells (length >= 3)
    for (let y = 1; y < H - 1; y++) {
      let seg = [];
      for (let x = 1; x < W - 1; x++) {
        if (grid[y][x] === PATH) seg.push({ x, y });
        else {
          if (seg.length >= 3) corridors.push({ axis: 'x', cells: seg });
          seg = [];
        }
      }
      if (seg.length >= 3) corridors.push({ axis: 'x', cells: seg });
    }

    // Vertical straight corridors of PATH cells (length >= 3)
    for (let x = 1; x < W - 1; x++) {
      let seg = [];
      for (let y = 1; y < H - 1; y++) {
        if (grid[y][x] === PATH) seg.push({ x, y });
        else {
          if (seg.length >= 3) corridors.push({ axis: 'y', cells: seg });
          seg = [];
        }
      }
      if (seg.length >= 3) corridors.push({ axis: 'y', cells: seg });
    }

    // Filter corridors sufficiently far from start burrow (>= 4 Manhattan)
    const validCorridors = corridors.filter((c) => {
      const mid = c.cells[Math.floor(c.cells.length / 2)];
      const dStart = Math.abs(mid.x - start.x) + Math.abs(mid.y - start.y);
      return dStart >= 4;
    });

    shuffle(validCorridors);

    // Pick corridors that are spaced apart
    const chosen = [];
    for (const c of validCorridors) {
      if (chosen.length >= numBeetles) break;
      const mid = c.cells[Math.floor(c.cells.length / 2)];
      const tooClose = chosen.some((other) => {
        const oMid = other.cells[Math.floor(other.cells.length / 2)];
        return Math.hypot(mid.x - oMid.x, mid.y - oMid.y) < 4.5;
      });
      if (!tooClose) chosen.push(c);
    }

    for (const c of validCorridors) {
      if (chosen.length >= numBeetles) break;
      if (!chosen.includes(c)) chosen.push(c);
    }

    chosen.forEach((c, idx) => {
      const mid = c.cells[Math.floor(c.cells.length / 2)];
      const isX = c.axis === 'x';
      beetles.push({
        id: `beetle-${idx}`,
        x: mid.x + 0.5,
        y: mid.y + 0.5,
        dx: isX ? (Math.random() < 0.5 ? 1 : -1) : 0,
        dy: isX ? 0 : (Math.random() < 0.5 ? 1 : -1),
        speed: 1.85,
        axis: c.axis,
        minCoord: (isX ? c.cells[0].x : c.cells[0].y) + 0.5,
        maxCoord: (isX ? c.cells[c.cells.length - 1].x : c.cells[c.cells.length - 1].y) + 0.5,
      });
    });
  }

  // Subterranean Encounters (Large Mazes Level 6+)
  // 1. Hot Spring (♨️): restores 100% stamina
  // 2. Mole Peddler (🕶️): trades vision lens, rocket shoes, drill
  // 3. Lucky Box (📦): hidden behind diggable soft dirt
  const encounters = [];
  if (level >= 6) {
    // 1. Underground Hot Spring
    if (spots.length > 0) {
      const [hx, hy] = spots.splice(0, 1)[0];
      encounters.push({
        id: 'spring-1',
        type: 'spring',
        x: hx,
        y: hy,
        used: false,
      });
    }

    // 2. Mole Peddler
    if (spots.length > 0) {
      const [mx, my] = spots.splice(0, 1)[0];
      encounters.push({
        id: 'merchant-1',
        type: 'merchant',
        x: mx,
        y: my,
      });
    }

    // 3. Mysterious Lucky Box (Hidden behind diggable soft dirt)
    // Find an unused dead end to place the chest, and seal its entrance with a SOFT dirt wall!
    let chestPlaced = false;
    for (const d of deadEnds) {
      // Don't place on start, exit, or landmark
      if (
        (d.x === start.x && d.y === start.y) ||
        (d.x === exit.x && d.y === exit.y) ||
        (d.x === landmark.x && d.y === landmark.y)
      ) continue;

      // Check if spot already occupied
      const occupied = materials.some(m => m.x === d.x && m.y === d.y) ||
                       carrots.some(c => c.x === d.x && c.y === d.y) ||
                       droplets.some(dr => dr.x === d.x && dr.y === d.y) ||
                       encounters.some(e => e.x === d.x && e.y === d.y);
      if (occupied) continue;

      // Find the single open path cell leading to this dead end
      let entrance = null;
      for (const [dx, dy] of DIRS) {
        const nx = d.x + dx, ny = d.y + dy;
        if (nx > 0 && ny > 0 && nx < W - 1 && ny < H - 1 && grid[ny][nx] === PATH) {
          entrance = [nx, ny];
          break;
        }
      }

      if (entrance) {
        // Seal entrance with SOFT diggable wall
        grid[entrance[1]][entrance[0]] = SOFT;
        encounters.push({
          id: 'chest-1',
          type: 'chest',
          x: d.x,
          y: d.y,
          opened: false,
        });
        chestPlaced = true;
        break;
      }
    }

    if (!chestPlaced && spots.length > 0) {
      const [cx, cy] = spots.splice(0, 1)[0];
      encounters.push({
        id: 'chest-1',
        type: 'chest',
        x: cx,
        y: cy,
        opened: false,
      });
    }
  }

  return {
    level, W, H, grid, start, exit, landmark, carrots, droplets, materials, beetles, encounters,
    x: start.x + 0.5, y: start.y + 0.5, facing: { x: 0, y: -1 },
    stamina: 100, water: 0, freeDigs: 0, drillActive: false, time: 0, digs: 0, particles: [], shake: 0, won: false, moving: false, beetleCooldown: 0,
    speedTimer: 0, visionTimer: 0,
  };
}

