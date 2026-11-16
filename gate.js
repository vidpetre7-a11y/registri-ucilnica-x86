function drawGate(canvas, gate, a, b) {
  const modes = {
    AND: { value: (x, y) => x & y, expression: "A ∧ B" },
    OR: { value: (x, y) => x | y, expression: "A ∨ B" },
    XOR: { value: (x, y) => x ^ y, expression: "A ⊕ B" },
    NAND: { value: (x, y) => 1 - (x & y), expression: "¬(A ∧ B)" }
  };
  const requested = String(gate).toUpperCase();
  const mode = Object.prototype.hasOwnProperty.call(modes, requested) ? requested : "AND";
  const first = Number(a) ? 1 : 0;
  const second = Number(b) ? 1 : 0;
  const output = modes[mode].value(first, second);
  if (!canvas) return output;
  const accessible = "Vrata " + mode + ". Vhod A je " + first + ", vhod B je " + second + ", izhod Y je " + output + ".";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", accessible);
  canvas.textContent = accessible;

  const baseWidth = 500;
  const baseHeight = 184;
  const ratio = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  const cssWidth = canvas.clientWidth || baseWidth;
  const width = Math.round(cssWidth * ratio);
  const height = Math.round(width * baseHeight / baseWidth);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  canvas.style.objectFit = "contain";
  const ctx = canvas.getContext("2d");
  if (!ctx) return output;
  ctx.save();
  ctx.setTransform(width / baseWidth, 0, 0, height / baseHeight, 0, 0);
  ctx.clearRect(0, 0, baseWidth, baseHeight);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const high = "#d5fd87";
  const low = "#8ab7a0";
  const ink = "#d2e6ce";
  const surface = "#17392e";
  const mono = '"IBM Plex Mono", ui-monospace, Menlo, monospace';

  function wire(points, value) {
    ctx.save();
    ctx.strokeStyle = value ? high : low;
    ctx.lineWidth = value ? 2.8 : 2;
    if (value) {
      ctx.shadowColor = "#c6f58e60";
      ctx.shadowBlur = 5;
    }
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.stroke();
    ctx.restore();
  }

  function label(text, x, y, color, font, align = "left") {
    ctx.fillStyle = color;
    ctx.font = font + " " + mono;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function port(x, y, name, value, isOutput) {
    const color = value ? high : low;
    ctx.fillStyle = surface;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.7;
    ctx.fillRect(x - 16, y - 13, 32, 26);
    ctx.strokeRect(x - 16, y - 13, 32, 26);
    label(String(value), x, y + 1, color, "bold 15px", "center");
    label(name, x, y - 25, ink, "bold 12px", "center");
    const pin = isOutput ? x - 17 : x + 17;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pin, y, 2.6, 0, 2 * Math.PI);
    ctx.fill();
  }

  const isAnd = mode === "AND" || mode === "NAND";
  const isNand = mode === "NAND";
  // Both OR-family inputs intersect the same quadratic at symmetric ordinates.
  const t = (72 - 46) / 88;
  const inputPinX = isAnd ? 204 : 199 + 66 * t * (1 - t);
  wire([[73, 48], [122, 48], [145, 72], [inputPinX, 72]], first);
  wire([[73, 133], [122, 133], [145, 108], [inputPinX, 108]], second);
  wire([[isNand ? 326 : 314, 90], [424, 90]], output);

  ctx.fillStyle = surface;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  if (isAnd) {
    ctx.moveTo(204, 46);
    ctx.lineTo(270, 46);
    ctx.arc(270, 90, 44, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(204, 134);
    ctx.closePath();
  } else {
    ctx.moveTo(199, 46);
    ctx.bezierCurveTo(250, 43, 291, 56, 314, 90);
    ctx.bezierCurveTo(291, 124, 250, 137, 199, 134);
    ctx.quadraticCurveTo(232, 90, 199, 46);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
  if (mode === "XOR") {
    ctx.beginPath();
    ctx.moveTo(190, 46);
    ctx.quadraticCurveTo(223, 90, 190, 134);
    ctx.stroke();
  }
  if (isNand) {
    ctx.fillStyle = surface;
    ctx.beginPath();
    ctx.arc(320, 90, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  label(mode, 252, 90, ink, "bold 16px", "center");
  label("Y = " + modes[mode].expression, 252, 160, "#b1cdba", "12px", "center");
  port(56, 48, "A", first, false);
  port(56, 133, "B", second, false);
  port(441, 90, "Y", output, true);
  ctx.restore();
  return output;
}
