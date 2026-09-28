export const PATH = 0, SOFT = 1, STONE = 2, EXIT = 3, BEDROCK = 4;
export const TILE = { PATH: 0, SOFT: 1, STONE: 2, WALL: 2, EXIT: 3, BEDROCK: 4 };
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** BFS distance map from (sx,sy) over PATH and EXIT cells purely by walking (0-dig) */
export function bfsDist(grid, W, H, sx, sy) {
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
 * Generates an adventure maze with:
 * - Dynamic Sizing: 15x15 up to 41x41
 * - Anti-Deadlock BFS Validation: 100% solvable purely by walking
 * - Exit Bedrock Protection: Surrounding walls encased in unbreakable BEDROCK
 * - Balanced item quantities and bait in dead-ends
 * - One-time hot spring for sizes >= 25
 */
export function createLevel(level, options = {}) {
  const isReplay = !!options.isReplay;
  // Dynamic Sizing: 15x15 up to 41x41
  const size = Math.min(41, 15 + Math.floor((level - 1) / 3) * 2);
  const W = size, H = size;
  const cw = (W - 1) / 2;
  const ch = (H - 1) / 2;
  const tier = Math.min(4, Math.floor((level - 1) / 8));

  let attempts = 0;
  while (attempts++ < 30) {
    const grid = Array.from({ length: H }, () => Array(W).fill(STONE));
    const seen = Array.from({ length: ch }, () => Array(cw).fill(false));

    // True recursive DFS — long corridors & real dead-ends
    const carve = (cx, cy) => {
      seen[cy][cx] = true;
      grid[cy * 2 + 1][cx * 2 + 1] = PATH;
      for (const [dx, dy] of shuffle(DIRS.slice())) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cw || ny >= ch || seen[ny][nx]) continue;
        grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = PATH;
        carve(nx, ny);
      }
    };
    carve(Math.floor(Math.random() * cw), Math.floor(Math.random() * ch));

    // Soft diggable walls ONLY deep inside (never on outer two rings)
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        if (grid[y][x] !== STONE) continue;
        if (x % 2 === y % 2) continue;
        const softChance = 0.28 + tier * 0.03;
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
        if (q1 === q2) continue;

        const mDist = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
        if (mDist < minRequiredMDist) continue;

        validPairs.push({ p1, p2, mDist });
      }
    }

    let sx, sy, ex, ey;
    if (validPairs.length > 0) {
      shuffle(validPairs);
      validPairs.sort((a, b) => b.mDist - a.mDist);
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
      sx = 1; sy = 1;
      ex = W - 2; ey = H - 2;
    }

    grid[ey][ex] = EXIT;

    // Outer border stays indestructible STONE
    for (let x = 0; x < W; x++) {
      if (grid[0][x] !== EXIT) grid[0][x] = STONE;
      if (grid[H - 1][x] !== EXIT) grid[H - 1][x] = STONE;
    }
    for (let y = 0; y < H; y++) {
      if (grid[y][0] !== EXIT) grid[y][0] = STONE;
      if (grid[y][W - 1] !== EXIT) grid[y][W - 1] = STONE;
    }

    // Exit Bedrock Protection:
    // The 2 tiles directly surrounding the Giant Carrot exit are unbreakable bedrock (TILE.BEDROCK)
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const bx = ex + dx, by = ey + dy;
        if (bx >= 0 && by >= 0 && bx < W && by < H) {
          if (grid[by][bx] === STONE || grid[by][bx] === SOFT) {
            grid[by][bx] = BEDROCK;
          }
        }
      }
    }

    const start = { x: sx, y: sy }, exit = { x: ex, y: ey };

    // Anti-Deadlock BFS: check pure walking path from start to exit
    const dist = bfsDist(grid, W, H, sx, sy);
    const bfsPathLen = dist[ey][ex];
    if (bfsPathLen <= 0) {
      continue; // regenerate if exit unreachable purely by walking
    }

    // Landmark: PATH nearest center, not start/exit
    let landmark = null;
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        if (grid[y][x] !== PATH) continue;
        if ((x === sx && y === sy) || (x === ex && y === ey)) continue;
        const d = Math.abs(x - (W - 1) / 2) + Math.abs(y - (H - 1) / 2);
        if (!landmark || d < landmark.d) landmark = { x, y, d };
      }
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

    // Balanced Resource Density & Strict Items formula:
    // pathTiles = 2 * ((size-1)/2)^2 - 1
    // Total items I = clamp(round(pathTiles / 50), 4, 16)
    // Water: max(1, round(I * 0.3)), Carrots: max(1, round(I * 0.2)), Materials: remainder
    // When isReplay is true: no water, no carrots, and no hot springs to prevent infinite stamina farming
    const pathTilesCount = 2 * Math.pow((size - 1) / 2, 2) - 1;
    let totalItems = Math.min(16, Math.max(4, Math.round(pathTilesCount / 50)));

    const nDroplets = isReplay ? 0 : Math.max(1, Math.round(totalItems * 0.3));
    const nCarrots = isReplay ? 0 : Math.max(1, Math.round(totalItems * 0.2));
    const maxMaterials = isReplay ? Math.min(8, Math.max(2, Math.round(pathTilesCount / 65))) : Math.max(2, totalItems - nDroplets - nCarrots);

    const spots = [];
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const farThreshold = W <= 15 ? 3 : 4;
        const far = (p) => Math.abs(p.x - x) + Math.abs(p.y - y) >= farThreshold;
        if (
          grid[y][x] === PATH &&
          !(x === landmark.x && y === landmark.y) &&
          far(start) &&
          far(exit) &&
          dist[y][x] > 0 // reachable purely by walking
        ) {
          spots.push([x, y]);
        }
      }
    }
    shuffle(spots);

    // Prioritize deep dead ends as bait for valuable items
    const prioritySpots = [];
    deadEnds.forEach((d) => {
      if (dist[d.y][d.x] > 0) prioritySpots.push([d.x, d.y]);
    });
    spots.forEach(([x, y]) => {
      if (!prioritySpots.some(([px, py]) => px === x && py === y)) {
        prioritySpots.push([x, y]);
      }
    });

    // 1. Carrots
    const carrots = prioritySpots.splice(0, nCarrots).map(([x, y]) => ({ x, y, taken: false }));

    // 2. Water Droplets
    const droplets = prioritySpots.splice(0, nDroplets).map(([x, y]) => ({
      x,
      y,
      type: 'water',
      ox: (Math.random() - 0.5) * 0.3,
      oy: (Math.random() - 0.5) * 0.3,
      taken: false,
    }));

    // Verify all water droplets are reachable purely by walking (Anti-Deadlock)
    const allDropletsReachable = droplets.every((d) => dist[d.y][d.x] > 0);
    if (!allDropletsReachable) {
      continue;
    }

    // 3. Materials
    const materials = [];
    let matBudget = maxMaterials;

    // Deep Shard if level >= 6 or random
    if (matBudget > 0 && prioritySpots.length > 0 && (Math.random() < 0.45 || level >= 6)) {
      const [sxMat, syMat] = prioritySpots.splice(0, 1)[0];
      materials.push({
        x: sxMat,
        y: syMat,
        type: 'shard',
        ox: 0,
        oy: 0,
        taken: false,
      });
      matBudget--;
    }

    const matTypes = ['fiber', 'clay'];
    // Guarantee fiber (corridor green grass) presence in every level
    if (matBudget > 0 && prioritySpots.length > 0) {
      const [fx, fy] = prioritySpots.splice(0, 1)[0];
      materials.push({
        x: fx,
        y: fy,
        type: 'fiber',
        ox: (Math.random() - 0.5) * 0.25,
        oy: (Math.random() - 0.5) * 0.25,
        taken: false,
      });
      matBudget--;
    }

    while (matBudget > 0 && prioritySpots.length > 0) {
      const [x, y] = prioritySpots.splice(0, 1)[0];
      const type = matTypes[Math.floor(Math.random() * matTypes.length)];
      materials.push({
        x,
        y,
        type,
        ox: (Math.random() - 0.5) * 0.35,
        oy: (Math.random() - 0.5) * 0.35,
        taken: false,
      });
      matBudget--;
    }

    // 4. Cave Beetles (Level 40+)
    const beetles = [];
    if (level >= 40) {
      const numBeetles = level >= 45 ? 3 : 2;
      const corridors = [];

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

      const validCorridors = corridors.filter((c) => {
        const mid = c.cells[Math.floor(c.cells.length / 2)];
        const dStart = Math.abs(mid.x - start.x) + Math.abs(mid.y - start.y);
        return dStart >= 5;
      });

      shuffle(validCorridors);
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

    // 5. Subterranean Encounters (Hot Spring when Size >= 25 or Level >= 6, never in replay)
    const encounters = [];
    if (size >= 25 || level >= 6) {
      // Exactly 1 Hot Spring (One-time use per level, omitted in replay to prevent farming)
      if (!isReplay && prioritySpots.length > 0) {
        const [hx, hy] = prioritySpots.splice(0, 1)[0];
        encounters.push({
          id: 'spring-1',
          type: 'spring',
          x: hx,
          y: hy,
          used: false,
        });
      }

      // Mole Peddler
      if (prioritySpots.length > 0) {
        const [mx, my] = prioritySpots.splice(0, 1)[0];
        encounters.push({
          id: 'merchant-1',
          type: 'merchant',
          x: mx,
          y: my,
        });
      }

      // Lucky Box hidden behind soft dirt
      let chestPlaced = false;
      for (const d of deadEnds) {
        if (
          (d.x === start.x && d.y === start.y) ||
          (d.x === exit.x && d.y === exit.y) ||
          (d.x === landmark.x && d.y === landmark.y)
        ) continue;

        const occupied = materials.some(m => m.x === d.x && m.y === d.y) ||
                         carrots.some(c => c.x === d.x && c.y === d.y) ||
                         droplets.some(dr => dr.x === d.x && dr.y === d.y) ||
                         encounters.some(e => e.x === d.x && e.y === d.y);
        if (occupied) continue;

        let entrance = null;
        for (const [dx, dy] of DIRS) {
          const nx = d.x + dx, ny = d.y + dy;
          if (nx > 0 && ny > 0 && nx < W - 1 && ny < H - 1 && grid[ny][nx] === PATH) {
            entrance = [nx, ny];
            break;
          }
        }

        if (entrance) {
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

      if (!chestPlaced && prioritySpots.length > 0) {
        const [cx, cy] = prioritySpots.splice(0, 1)[0];
        encounters.push({
          id: 'chest-1',
          type: 'chest',
          x: cx,
          y: cy,
          opened: false,
        });
      }
    }

    // Footprint trail tracking
    const visited = Array.from({ length: H }, () => Array(W).fill(false));
    visited[start.y][start.x] = true;

    return {
      level,
      isReplay,
      digCost: 18,
      W,
      H,
      grid,
      start,
      exit,
      landmark,
      carrots,
      droplets,
      materials,
      beetles,
      encounters,
      bfsPathLen,
      visited,
      x: start.x + 0.5,
      y: start.y + 0.5,
      facing: { x: 1, y: 0 },
      facingLeft: false,
      smoothTilt: 0,
      stamina: 100,
      water: 0,
      freeDigs: 0,
      drillActive: false,
      time: 0,
      digs: 0,
      particles: [],
      shake: 0,
      won: false,
      moving: false,
      beetleCooldown: 0,
      speedTimer: 0,
      visionTimer: 0,
    };
  }

  // Fallback in rare case
  return createLevel(1, options);
}
