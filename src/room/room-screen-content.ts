export const drawLaptopScreen = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) => {
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, w, h);

  const tabH = Math.floor(h * 0.14);
  ctx.fillStyle = "#252526";
  ctx.fillRect(0, 0, w, tabH);
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, tabH - 2, w * 0.38, tabH + 2);

  ctx.fillStyle = "#cccccc";
  ctx.font = `600 ${Math.floor(tabH * 0.42)}px Consolas, monospace`;
  ctx.fillText("App.tsx", 8, tabH * 0.72);
  ctx.fillStyle = "#858585";
  ctx.font = `400 ${Math.floor(tabH * 0.38)}px Consolas, monospace`;
  ctx.fillText("room-scene.ts", w * 0.42, tabH * 0.72);

  const sidebarW = Math.floor(w * 0.22);
  ctx.fillStyle = "#181818";
  ctx.fillRect(0, tabH, sidebarW, h - tabH);

  const codeX = sidebarW + 10;
  const lineH = Math.floor(h * 0.11);
  const lines = [
    { n: 1, parts: [{ c: "#569cd6", t: "export " }, { c: "#dcdcaa", t: "function " }, { c: "#dcdcaa", t: "Room()" }] },
    { n: 2, parts: [{ c: "#cccccc", t: "  " }, { c: "#c586c0", t: "return" }, { c: "#cccccc", t: " (" }] },
    { n: 3, parts: [{ c: "#cccccc", t: "    <" }, { c: "#4ec9b0", t: "Canvas" }, { c: "#cccccc", t: ">" }] },
    { n: 4, parts: [{ c: "#cccccc", t: "      <" }, { c: "#4ec9b0", t: "ActiveScreens" }, { c: "#cccccc", t: " />" }] },
    { n: 5, parts: [{ c: "#cccccc", t: "    </" }, { c: "#4ec9b0", t: "Canvas" }, { c: "#cccccc", t: ">" }] },
    { n: 6, parts: [{ c: "#cccccc", t: "  );" }] },
  ];

  ctx.fillStyle = "#858585";
  ctx.font = `${Math.floor(lineH * 0.55)}px Consolas, monospace`;
  lines.forEach((line, i) => {
    const y = tabH + 12 + i * lineH;
    ctx.fillStyle = "#858585";
    ctx.fillText(String(line.n), 6, y);
    let x = codeX;
    line.parts.forEach((part) => {
      ctx.fillStyle = part.c;
      ctx.fillText(part.t, x, y);
      x += ctx.measureText(part.t).width;
    });
  });

  const typedChars = Math.floor(t * 6) % 28;
  const typingLine = tabH + 12 + lines.length * lineH;
  ctx.fillStyle = "#858585";
  ctx.fillText(String(7), 6, typingLine);
  const snippet = '  // shipping features…'.slice(0, typedChars);
  ctx.fillStyle = "#6a9955";
  ctx.fillText(snippet, codeX, typingLine);
  if (Math.floor(t * 2.5) % 2 === 0) {
    ctx.fillStyle = "#aeafad";
    ctx.fillRect(codeX + ctx.measureText(snippet).width + 1, typingLine - lineH * 0.55, 2, lineH * 0.65);
  }

  const termY = h - Math.floor(h * 0.22);
  ctx.fillStyle = "#181818";
  ctx.fillRect(0, termY, w, h - termY);
  ctx.fillStyle = "#4ec9b0";
  ctx.font = `${Math.floor(h * 0.075)}px Consolas, monospace`;
  ctx.fillText("npm run dev", 8, termY + Math.floor(h * 0.1));
  ctx.fillStyle = "#6a9955";
  ctx.fillText("✓ ready on localhost:5173", 8, termY + Math.floor(h * 0.17));
};

export const drawMonitorScreen = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) => {
  ctx.fillStyle = "#0a0f0a";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#166534";
  ctx.font = `600 ${Math.floor(h * 0.09)}px Consolas, monospace`;
  ctx.fillText("STUDIO_BOOT.SYS", 12, Math.floor(h * 0.14));

  const lines = [
    "> mounting /dev/cv … ok",
    "> loading projects index … ok",
    "> ambient audio … optional",
    "> pointer lock … waiting",
  ];
  const scroll = Math.floor(t * 0.8) % (lines.length + 1);
  ctx.fillStyle = "#4ade80";
  ctx.font = `${Math.floor(h * 0.075)}px Consolas, monospace`;
  lines.forEach((line, i) => {
    if (i < scroll) return;
    const y = Math.floor(h * 0.28) + (i - scroll) * Math.floor(h * 0.12);
    if (y > h - 20) return;
    ctx.fillText(line, 12, y);
  });

  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = "#4ade80";
    ctx.fillText("_", 12, h - 16);
  }

  ctx.fillStyle = "rgba(74, 222, 128, 0.06)";
  for (let y = 0; y < h; y += 2) {
    ctx.fillRect(0, y, w, 1);
  }
};
