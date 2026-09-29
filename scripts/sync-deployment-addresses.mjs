#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const addressPattern = /^0x[0-9a-fA-F]{40}$/;

// Match the existing GitBook HTML tables without reformatting their contents.
export function syncAddresses(markdown, resolveAddress) {
  const changes = [];
  const missing = [];
  let matched = 0;
  const output = markdown.replace(
    /(\{%\s*tab\s+title="([^"]+)"\s*%\})([\s\S]*?)(\{%\s*endtab\s*%\})/g,
    (tab, start, chain, body, end) => start + body.replace(
      /(<tr\b[^>]*>\s*<td\b[^>]*>)([^<]+)(<\/td>\s*<td\b[^>]*>)([\s\S]*?)(<\/td>)/g,
      (row, first, label, middle, cell, last) => {
        const name = label.trim();
        const address = resolveAddress(chain, name);
        if (address === undefined) {
          missing.push(`${chain}/${name}`);
          return row;
        }
        if (typeof address !== 'string' || !addressPattern.test(address)
            || /^0x0{40}$/i.test(address)) {
          throw new Error(`Invalid deployment address: ${chain}/${name}`);
        }
        // Both the visible address and explorer target must be updated together.
        const link = cell.match(/^(\s*<a\s+href=")([^"\s]+)("[^>]*>)(0x[0-9a-fA-F]{40})(<\/a>\s*)$/);
        if (!link || !/^https:\/\/[^/]+\/address\/0x[0-9a-fA-F]{40}(?:[?#].*)?$/.test(link[2])) {
          throw new Error(`Unsupported address cell: ${chain}/${name}`);
        }
        const url = link[2].replace(/(\/address\/)0x[0-9a-fA-F]{40}/, `$1${address}`);
        const nextCell = link[1] + url + link[3] + address + link[5];
        matched++;
        if (nextCell !== cell) {
          changes.push({ chain, name, before: link[4], beforeUrl: link[2], address, url });
        }
        return first + label + middle + nextCell + last;
      }
    ) + end
  );
  return { output, changes, missing, matched };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

export function createResolver(deployments, config = {}) {
  const directories = fs.readdirSync(deployments, { withFileTypes: true }).filter(e => e.isDirectory());
  const cache = new Map();
  return (chain, name) => {
    const network = config.networks?.[chain] ?? chain.toLowerCase();
    if (typeof network !== 'string' || !network || /[\\/]/.test(network) || network === '..') {
      throw new Error(`Invalid network directory mapping: ${chain}`);
    }
    const candidates = directories.filter(e => e.name.toLowerCase() === network.toLowerCase());
    if (candidates.length > 1) throw new Error(`Ambiguous network directory: ${chain}`);
    if (!candidates.length) return undefined;
    const directory = path.join(deployments, candidates[0].name);
    if (!cache.has(directory)) {
      cache.set(directory, fs.readdirSync(directory, { withFileTypes: true })
        .filter(e => e.isFile() && e.name.endsWith('.json')).map(e => e.name));
    }
    // Explicit aliases only: never guess which similarly named strategy to use.
    const contract = config.contractsByNetwork?.[chain]?.[name] ?? config.contracts?.[name] ?? name;
    if (typeof contract !== 'string' || !contract || /[\\/]/.test(contract)) {
      throw new Error(`Invalid contract mapping: ${chain}/${name}`);
    }
    const filename = `${contract}.json`;
    if (!cache.get(directory).includes(filename)) return undefined;
    const file = path.join(directory, filename);
    const data = readJson(file);
    if (!data || typeof data.address !== 'string') throw new Error(`Missing top-level address: ${file}`);
    return data.address;
  };
}

function main(args) {
  const localDeployments = path.join(root, 'deployments');
  const options = {
    deployments: fs.existsSync(localDeployments) ? localDeployments : path.resolve(root, '../whitepaper/deployments/deployments'),
    document: path.join(root, 'users-guide/he-yue-di-zhi.md'),
    config: path.join(root, 'scripts/deployment-mappings.json'),
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--write' || arg === '--strict') options[arg.slice(2)] = true;
    else if (['--deployments', '--document', '--config'].includes(arg)) {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Missing value: ${arg}`);
      options[arg.slice(2)] = path.resolve(args[++i]);
    } else if (arg === '--help') {
      console.log('Usage: node scripts/sync-deployment-addresses.mjs [--deployments DIR] [--document FILE] [--config FILE] [--strict] [--write]\nDefault: preview only. --write saves changes. --strict fails if any documented contract is missing.');
      return;
    } else throw new Error(`Unknown option: ${arg}`);
  }
  const config = options.config ? readJson(options.config) : {};
  const original = fs.readFileSync(options.document, 'utf8');
  const result = syncAddresses(original, createResolver(options.deployments, config));
  for (const item of result.changes) {
    console.log(`${item.chain}/${item.name}: ${item.before} -> ${item.address}\n  ${item.beforeUrl} -> ${item.url}`);
  }
  if (result.missing.length) console.log(`Not found (unchanged):\n  ${result.missing.join('\n  ')}`);
  if (!result.matched) throw new Error('No documented contracts matched deployment files; nothing was written.');
  if (options.strict && result.missing.length) throw new Error('Missing deployments in strict mode; nothing was written.');
  console.log(`Matched: ${result.matched}; changed: ${result.changes.length}; missing: ${result.missing.length}`);
  if (options.write && result.changes.length) {
    // Avoid overwriting an edit made while deployment files were being read.
    if (fs.readFileSync(options.document, 'utf8') !== original) throw new Error('Document changed during sync; retry.');
    fs.writeFileSync(options.document, result.output, 'utf8');
    console.log(`Updated: ${options.document}`);
  } else console.log(options.write ? 'Already up to date.' : 'Preview only. Add --write to save.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(`Error: ${error.message}`); process.exitCode = 1; }
}
