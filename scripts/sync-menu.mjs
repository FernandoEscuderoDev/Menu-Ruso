/**
 * Sincroniza el menú desde Google Sheets a src/data/menu.csv.
 *
 *   npm run sync:menu              -> descarga la hoja pública
 *   node scripts/sync-menu.mjs <f>  -> procesa un CSV local
 *
 * El CSV crudo trae ~950 filas vacías al final (Google Sheets reserva filas).
 * Este script limpia, normaliza encabezados y deja sólo las filas con producto.
 */
import { writeFile, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/menu.csv');
const SHEET_ID = '1JKEux7QTOlvP10-_dmSw7NJCE3fjeZZQnW0ZYrBguRE';

const strip = (s) => String(s ?? '').replace(/^﻿/, '').trim();
const col = (s) => strip(s).replace(/\s+/g, ' ');

/** Divide una línea CSV respetando comillas dobles. */
function parseLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const args = process.argv.slice(2);
let raw;
if (args[0]) {
  raw = await readFile(resolve(ROOT, args[0]), 'utf8');
  console.log(`→ Leyendo ${args[0]}`);
} else {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  console.log('→ Descargando Google Sheet…');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets respondió ${res.status}`);
  raw = await res.text();
}

const lines = raw.split(/\r?\n/).filter((l) => l.trim().length);
const header = parseLine(lines[0]).map((h) => h.toLowerCase().trim());

const pick = (row, name) => row[header.indexOf(name)] ?? '';
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const seen = new Map(); // slug -> veces visto
const rows = [];

for (const line of lines.slice(1)) {
  const r = parseLine(line);
  const section = col(r[idx['sección'] ?? idx['seccion']]);
  const name = col(r[idx['producto']]);
  const price = strip(r[idx['precio']]);
  const available = strip(r[idx['disponible']]).toUpperCase();

  // Descarta filas vacías / de relleno de Sheets.
  if (!name || (!section && !price)) continue;
  if (available === 'FALSE') continue;

  const base = name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const n = (seen.get(base) ?? 0) + 1;
  seen.set(base, n);
  const slug = n === 1 ? base : `${base}-${n}`;

  rows.push({ slug, section, name, description: col(r[idx['descripción'] ?? idx['descripcion']]), price, photo: strip(r[idx['foto']]) });
}

const csv = [
  'slug,seccion,producto,descripcion,precio,foto',
  ...rows.map((r) =>
    [r.slug, r.section, r.name, r.description, r.price, r.photo].map(esc).join(',')
  ),
].join('\n');

await writeFile(OUT, csv + '\n', 'utf8');

const sections = new Set(rows.map((r) => r.section));
console.log(`✓ ${rows.length} productos · ${sections.size} secciones`);
console.log(`  → ${OUT}`);
for (const s of sections) {
  console.log(`    · ${s}: ${rows.filter((r) => r.section === s).length}`);
}