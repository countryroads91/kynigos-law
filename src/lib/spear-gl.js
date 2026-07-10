// Raw-WebGL spearhead for the hero—no three.js, ~4KB. The blade is the logo
// silhouette extruded to a diamond cross-section (two faces meeting at a
// central spine, like a forged point), flat-shaded so the facets catch light
// as it turns. Plain JS with no imports so the static preview pipeline can
// inline this file verbatim.
//
// Motion rules: upright Y-axis rotation only (the mark never tilts over),
// a single static frame under prefers-reduced-motion, and the loop pauses
// whenever the canvas leaves the viewport.

// The mark is a swallow-tail spearhead: a solid tip that splits into two
// trailing wings around a deep central notch (see the logo SVG). Each strip
// below is [ySvg, centerlineOffsetX, halfWidth], traced from the logo path.
const TIP = [
  [0, 0, 0.01],
  [10, 0, 2],
  [25, 0, 4],
  [38, 0, 6],
  [42, 0, 6.6],
];
const WING = [
  [42, 3.3, 3.3],
  [48, 4.3, 3.3],
  [60, 5.6, 4.2],
  [72, 7.15, 5.15],
  [92, 9.75, 6.75],
  [110, 12.3, 8.3],
  [125, 14.5, 9.5],
  [132, 15.9, 10.0],
  [138, 14.0, 8.0],
  [143, 11.75, 5.25],
  [150, 9.15, 1.85],
  [155, 8.0, 0.05],
];

const SVG_HEIGHT = 175; // matches the logo viewBox
const SCALE = 1 / 95;

function buildGeometry() {
  const positions = [];
  const normals = [];

  function tri(a, b, c) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    for (const p of [a, b, c]) {
      positions.push(p[0] * SCALE, p[1] * SCALE, p[2] * SCALE);
      normals.push(nx, ny, nz);
    }
  }

  function quad(a, b, c, d) {
    tri(a, b, c);
    tri(a, c, d);
  }

  const y3 = (ySvg) => SVG_HEIGHT / 2 - ySvg; // flip to y-up, center vertically
  const depth = (w) => Math.max(1.2, w * 0.6);

  // One faceted diamond-section strip: four facets per segment.
  function strip(profile, mirror) {
    for (let i = 0; i < profile.length - 1; i++) {
      const [ya, ca, wa] = profile[i];
      const [yb, cb, wb] = profile[i + 1];
      const xa = mirror * ca, xb = mirror * cb;
      const za = depth(wa), zb = depth(wb);
      const A = y3(ya), B = y3(yb);

      const edgeLa = [xa - wa, A, 0], edgeLb = [xb - wb, B, 0];
      const edgeRa = [xa + wa, A, 0], edgeRb = [xb + wb, B, 0];
      const spineFa = [xa, A, za], spineFb = [xb, B, zb];
      const spineBa = [xa, A, -za], spineBb = [xb, B, -zb];

      quad(edgeLa, spineFa, spineFb, edgeLb); // front-left
      quad(spineFa, edgeRa, edgeRb, spineFb); // front-right
      quad(spineBa, edgeLa, edgeLb, spineBb); // back-left
      quad(edgeRa, spineBa, spineBb, edgeRb); // back-right
    }
  }

  strip(TIP, 1); // solid tip
  strip(WING, 1); // right wing
  strip(WING, -1); // left wing

  // Base bar (the logo's socket): a shallow trapezoid prism.
  const bt = y3(163), bb = y3(169), hw1 = 29, hw2 = 27, bd = 3;
  const F = [[-hw1, bt, bd], [hw1, bt, bd], [hw2, bb, bd], [-hw2, bb, bd]];
  const K = [[-hw1, bt, -bd], [hw1, bt, -bd], [hw2, bb, -bd], [-hw2, bb, -bd]];
  quad(F[0], F[1], F[2], F[3]); // front
  quad(K[1], K[0], K[3], K[2]); // back
  quad(K[0], K[1], F[1], F[0]); // top
  quad(F[3], F[2], K[2], K[3]); // bottom
  quad(K[0], F[0], F[3], K[3]); // left
  quad(F[1], K[1], K[2], F[2]); // right

  return { positions: new Float32Array(positions), normals: new Float32Array(normals) };
}

const VERT = `
attribute vec3 aPos;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uProj;
varying vec3 vNormal;
varying vec3 vPos;
void main() {
  vec4 world = uModel * vec4(aPos, 1.0);
  vNormal = mat3(uModel) * aNormal;
  vPos = world.xyz;
  gl_Position = uProj * world;
}`;

const FRAG = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPos;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vec3(0.0, 0.0, 4.2) - vPos);
  vec3 key = normalize(vec3(0.85, 0.35, 0.55));
  vec3 fill = normalize(vec3(-0.7, -0.15, 0.35));

  float diff = max(dot(N, key), 0.0);
  float soft = max(dot(N, fill), 0.0) * 0.4;
  float spec = pow(max(dot(reflect(-key, N), V), 0.0), 20.0) * 0.45;
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.20;

  vec3 dark = vec3(0.290, 0.114, 0.137);   /* pressed oxblood */
  vec3 base = vec3(0.447, 0.184, 0.216);   /* #722F37 */
  vec3 hi   = vec3(0.604, 0.290, 0.325);   /* hover oxblood */
  vec3 parchment = vec3(0.992, 0.980, 0.961);

  vec3 color = mix(dark, base, clamp(diff + soft, 0.0, 1.0));
  color = mix(color, hi, spec);
  color += parchment * rim;
  gl_FragColor = vec4(color, 1.0);
}`;

function perspective(fovY, aspect, near, far) {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function modelMatrix(angleY, tiltX, floatY, zOffset) {
  const cy = Math.cos(angleY), sy = Math.sin(angleY);
  const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
  // rotY then rotX, translated back from the camera.
  return new Float32Array([
    cy, sx * sy, -cx * sy, 0,
    0, cx, sx, 0,
    sy, -sx * cy, cx * cy, 0,
    0, floatY, zOffset, 1,
  ]);
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
  return s;
}

/**
 * Boot the spear on a canvas. Returns a cleanup function, or null when WebGL
 * is unavailable (callers fall back to the static SVG mark).
 * @param {HTMLCanvasElement} canvas
 * @param {{ reducedMotion?: boolean }} [opts]
 */
export function initSpearGL(canvas, opts) {
  const reducedMotion = Boolean(opts && opts.reducedMotion);
  let gl = null;
  try {
    gl = canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      canvas.getContext("experimental-webgl", { alpha: true, antialias: true });
  } catch {
    gl = null;
  }
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const geo = buildGeometry();
  const vertexCount = geo.positions.length / 3;

  function bindAttr(name, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
  }
  bindAttr("aPos", geo.positions);
  bindAttr("aNormal", geo.normals);

  const uModel = gl.getUniformLocation(prog, "uModel");
  const uProj = gl.getUniformLocation(prog, "uProj");

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  let raf = 0;
  let running = false;
  let disposed = false;
  let start = null;
  let pointerTilt = 0;
  let pointerTurn = 0;
  let targetTilt = 0;
  let targetTurn = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function draw(now) {
    resize();
    if (start === null) start = now;
    const t = (now - start) / 1000;

    // Ease the pointer parallax toward its target.
    pointerTilt += (targetTilt - pointerTilt) * 0.06;
    pointerTurn += (targetTurn - pointerTurn) * 0.06;

    // Intro: settle from a steeper angle over the first ~1.6s.
    const settle = Math.min(t / 1.6, 1);
    const eased = 1 - Math.pow(1 - settle, 3);
    const angle = reducedMotion
      ? -0.55
      : -1.6 + eased * 1.05 + t * 0.22 + pointerTurn;
    const tilt = 0.06 + pointerTilt;
    const floatY = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.018;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const aspect = canvas.width / Math.max(canvas.height, 1);
    gl.uniformMatrix4fv(uProj, false, perspective(0.52, aspect, 0.1, 20));
    gl.uniformMatrix4fv(uModel, false, modelMatrix(angle, tilt, floatY, -4.2));
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }

  function loop(now) {
    if (!running) return;
    draw(now);
    if (!reducedMotion) {
      raf = requestAnimationFrame(loop);
    }
  }

  function play() {
    if (running || disposed) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function pause() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function onPointer(e) {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    targetTurn = nx * 0.35;
    targetTilt = ny * 0.12;
  }

  const hoverCapable =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (hoverCapable && !reducedMotion) {
    window.addEventListener("pointermove", onPointer, { passive: true });
  }

  // Only burn frames while the canvas is actually on screen.
  let io = null;
  if (typeof IntersectionObserver === "function") {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) play();
        else pause();
      }
    });
    io.observe(canvas);
  } else {
    play();
  }

  function onContextLost(e) {
    e.preventDefault();
    pause();
  }
  canvas.addEventListener("webglcontextlost", onContextLost);

  return function cleanup() {
    disposed = true;
    pause();
    if (io) io.disconnect();
    if (hoverCapable) window.removeEventListener("pointermove", onPointer);
    canvas.removeEventListener("webglcontextlost", onContextLost);
  };
}
