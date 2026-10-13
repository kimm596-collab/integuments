
const container = document.getElementById("logo-container");
const glitchLayer = document.getElementById("glitch-layer");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const random = (min, max) =>
  Math.random() * (max - min) + min;

const randomInt = (min, max) =>
  Math.floor(random(min, max + 1));

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let running = true;

/* ORIGINAL HORIZONTAL GLITCH */

function createFragment() {
  const fragment = document.createElement("div");
  fragment.className = "glitch-fragment";

  const top = random(0, 96);
  const height = random(1, 13);
  const bottom = Math.min(100, top + height);

  const shiftX = random(-19, 19);
  const shiftY = random(-2, 2);

  fragment.style.clipPath =
    `polygon(
      0 ${top}%,
      100% ${top}%,
      100% ${bottom}%,
      0 ${bottom}%
    )`;

  fragment.style.transform =
    `translate(${shiftX}px, ${shiftY}px)`;

  fragment.style.opacity = random(0.65, 1);

  glitchLayer.appendChild(fragment);

  return fragment;
}

/* BLACK SIGNAL BLOCKS */

function createSignalBlock() {
  const block = document.createElement("div");
  block.className = "signal-block";

  block.style.left = `${random(0, 95)}%`;
  block.style.top = `${random(0, 95)}%`;
  block.style.width = `${random(2, 22)}%`;
  block.style.height = `${random(1, 4)}px`;
  block.style.opacity = random(0.5, 0.95);

  glitchLayer.appendChild(block);

  return block;
}

/* SMALL WHITE SPARKS */

function createWhiteSpark() {
  const spark = document.createElement("div");
  spark.className = "white-spark";

  spark.style.left = `${random(0, 98)}%`;
  spark.style.top = `${random(5, 95)}%`;

  spark.style.width = `${random(2, 13)}px`;
  spark.style.height = `${random(1, 2)}px`;

  spark.style.opacity = random(0.55, 1);

  glitchLayer.appendChild(spark);

  return spark;
}

/* OCCASIONAL RGB GLITCH */

function createRGBFragment() {
  const fragment = document.createElement("div");

  const color = Math.random() < 0.5
    ? "rgb-red"
    : "rgb-blue";

  fragment.className = `rgb-fragment ${color}`;

  const top = random(0, 95);
  const height = random(1, 6);
  const bottom = Math.min(100, top + height);

  fragment.style.clipPath =
    `polygon(
      0 ${top}%,
      100% ${top}%,
      100% ${bottom}%,
      0 ${bottom}%
    )`;

  fragment.style.transform =
    `translate(${random(-5, 5)}px, 0)`;

  fragment.style.opacity = random(0.3, 0.65);

  glitchLayer.appendChild(fragment);

  return fragment;
}

/* MAIN GLITCH BURST */

async function glitchBurst() {
  const numberOfFrames = randomInt(2, 7);

  for (let frame = 0; frame < numberOfFrames; frame++) {
    if (!running) return;

    const fragments = [];
    const fragmentCount = randomInt(2, 7);

    // Original black glitch
    for (let i = 0; i < fragmentCount; i++) {
      fragments.push(createFragment());
    }

    // Black signal interruptions
    if (Math.random() < 0.5) {
      const blockCount = randomInt(1, 3);

      for (let i = 0; i < blockCount; i++) {
        fragments.push(createSignalBlock());
      }
    }

    // White sparks: occasional
    if (Math.random() < 0.35) {
      const sparkCount = randomInt(1, 3);

      for (let i = 0; i < sparkCount; i++) {
        fragments.push(createWhiteSpark());
      }
    }

    // RGB interference: rare
    if (Math.random() < 0.12) {
      fragments.push(createRGBFragment());
    }

    await wait(random(25, 85));

    fragments.forEach((fragment) => fragment.remove());

    await wait(random(10, 65));
  }
}

/* CONTINUOUS RANDOM GLITCH */

async function startGlitch() {
  if (reduceMotion) return;

  await wait(200);

  while (running) {
    await glitchBurst();

    const pause = Math.random() < 0.35
      ? random(35, 130)
      : random(160, 550);

    await wait(pause);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    glitchLayer.replaceChildren();
  }
});

startGlitch();
