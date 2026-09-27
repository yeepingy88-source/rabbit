(async () => {
  const n = 7;
  const parts = [];
  for (let i = 0; i < n; i++) {
    const res = await fetch(new URL(`./chunk${i}.js`, import.meta.url));
    if (!res.ok) throw new Error('Failed to load chunk ' + i + ' (' + res.status + ')');
    parts.push(await res.text());
  }
  const code = parts.join('');
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  await import(url);
})().catch(err => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="padding:2rem;font-family:sans-serif;color:#b91c1c">Load error: ' +
      String(err) + '</div>';
  }
  console.error(err);
});
