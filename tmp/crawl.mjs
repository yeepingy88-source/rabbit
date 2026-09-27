async function test() {
  const visited = new Set();
  const queue = ["/", "/src/main.jsx"];
  const errors = [];

  while (queue.length > 0) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const res = await fetch("http://127.0.0.1:3000" + url);
      if (!res.ok) {
        errors.push({ url, status: res.status, statusText: res.statusText });
        continue;
      }
      const text = await res.text();
      const importRegex = /(?:import|export)\s+(?:.*?from\s+)?['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(text)) !== null) {
        let dep = match[1];
        if (dep.startsWith("/") && !dep.startsWith("//")) {
          if (!visited.has(dep)) queue.push(dep);
        } else if (dep.startsWith("./") || dep.startsWith("../")) {
          const base = url.substring(0, url.lastIndexOf("/"));
          const resolved = new URL(dep, "http://127.0.0.1:3000" + base + "/").pathname;
          if (!visited.has(resolved)) queue.push(resolved);
        }
      }
    } catch (e) {
      errors.push({ url, error: e.message });
    }
  }

  console.log("Visited count:", visited.size);
  console.log("Errors:", JSON.stringify(errors, null, 2));
}
test();
