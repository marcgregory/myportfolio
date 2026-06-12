import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const maxBytes = 200 * 1024;

const publicPath = (...segments) => path.join(root, "public", ...segments);

const ensureDir = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const writeUnderLimit = async ({
  input,
  output,
  width,
  format,
  fit = "inside",
}) => {
  await ensureDir(output);

  const qualities =
    format === "avif" ? [58, 52, 46, 40, 34, 28, 22] : [82, 76, 70, 64, 58, 52, 46];

  for (const quality of qualities) {
    let pipeline = sharp(input).resize({
      width,
      fit,
      withoutEnlargement: true,
    });

    if (format === "avif") {
      pipeline = pipeline.avif({ quality, effort: 6 });
    } else {
      pipeline = pipeline.webp({ quality, effort: 6 });
    }

    const buffer = await pipeline.toBuffer();

    if (buffer.byteLength <= maxBytes || quality === qualities.at(-1)) {
      await fs.writeFile(output, buffer);
      const sizeKb = (buffer.byteLength / 1024).toFixed(1);
      const status = buffer.byteLength <= maxBytes ? "ok" : "over-limit";
      console.log(`${status} ${path.relative(root, output)} ${sizeKb} KB`);
      return buffer.byteLength;
    }
  }
};

const heroSource = publicPath("hero", "marc-hero.png");

for (const width of [640, 960]) {
  await writeUnderLimit({
    input: heroSource,
    output: publicPath("hero", `marc-hero-${width}.avif`),
    width,
    format: "avif",
  });
  await writeUnderLimit({
    input: heroSource,
    output: publicPath("hero", `marc-hero-${width}.webp`),
    width,
    format: "webp",
  });
}

const projects = [
  "volendaystaffing",
  "lendami",
  "asiaceo",
  "sweet-memo-keeper",
  "musicsheet-studio",
];

for (const project of projects) {
  const input = publicPath("projects", `${project}.png`);

  await writeUnderLimit({
    input,
    output: publicPath("projects", `${project}-card.avif`),
    width: 900,
    format: "avif",
  });
  await writeUnderLimit({
    input,
    output: publicPath("projects", `${project}-card.webp`),
    width: 900,
    format: "webp",
  });
}

const clients = [
  ["avatar", publicPath("avatar.png")],
  ["volendaystaffing", publicPath("projects", "volendaystaffing.png")],
  ["lendami", publicPath("projects", "lendami.png")],
];

for (const [name, input] of clients) {
  await writeUnderLimit({
    input,
    output: publicPath("clients", `${name}-80.webp`),
    width: 80,
    format: "webp",
    fit: "cover",
  });
}
