import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { syncAddresses, createResolver } from './sync-deployment-addresses.mjs';

const a = '0x' + '1'.repeat(40);
const b = '0x' + '2'.repeat(40);
const c = '0x' + '3'.repeat(40);
const tab = (chain, name, shown = a) => `{% tab title="${chain}" %}\r\n<table><tr><td>${name}</td><td><a href="https://example.com/address/${a}?chain=pacific-1&#x26;tab=transactions">${shown}</a></td><td></td></tr></table>\r\n{% endtab %}`;

test('updates visible address and mismatched link, preserving query, markup and CRLF; idempotent', () => {
  const original = tab('Sei', 'ChildstTD', b);
  const result = syncAddresses(original, () => b);
  assert.equal(result.output, original.replace(`/address/${a}`, `/address/${b}`));
  assert.equal(result.changes.length, 1);
  assert.equal(syncAddresses(result.output, () => b).changes.length, 0);
});

test('matches each chain separately; missing names are retained and reported', () => {
  const original = tab('Base', 'Strategy') + tab('Sei', 'Strategy') + tab('Sonic', 'Unknown');
  const result = syncAddresses(original, (chain) => ({ Base: b, Sei: c })[chain]);
  assert.equal(result.matched, 2);
  assert.deepEqual(result.missing, ['Sonic/Unknown']);
  assert.ok(result.output.includes(tab('Sonic', 'Unknown')));
  assert.equal(result.changes[1].address, c);
});

test('rejects invalid and zero addresses or unrecognized cells', () => {
  for (const address of ['invalid', '0x' + '0'.repeat(40), null]) {
    assert.throws(() => syncAddresses(tab('Base', 'Strategy'), () => address), /Invalid/);
  }
  assert.throws(() => syncAddresses(tab('Base', 'Strategy').replace('https:', 'http:'), () => b), /Unsupported/);
});

test('resolves explicit aliases and exact artifacts, never implementation or update files', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tizi-sync-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'sei_mainnet'));
  for (const [name, address] of [['SubVault', b], ['SubVault_Implementation', c], ['SubVaultUpdate', a]]) {
    fs.writeFileSync(path.join(dir, 'sei_mainnet', `${name}.json`), JSON.stringify({ address }));
  }
  const resolve = createResolver(dir, { networks: { Sei: 'sei_mainnet' }, contracts: { SubValut: 'SubVault' } });
  assert.equal(resolve('Sei', 'SubValut'), b);
  assert.equal(resolve('Sei', 'Unknown'), undefined);
  assert.equal(resolve('Base', 'SubValut'), undefined);
});

test('CLI previews without writing, strict failure is atomic, and write is repeatable', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tizi-sync-cli-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'base_mainnet'));
  fs.writeFileSync(path.join(dir, 'base_mainnet', 'Strategy.json'), JSON.stringify({ address: b }));
  const doc = path.join(dir, 'doc.md');
  const original = tab('Base', 'Strategy') + tab('Base', 'Missing');
  fs.writeFileSync(doc, original);
  const script = fileURLToPath(new URL('./sync-deployment-addresses.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [script, '--deployments', dir, '--document', doc, ...args], { encoding: 'utf8' });
  assert.equal(run().status, 0);
  assert.equal(fs.readFileSync(doc, 'utf8'), original);
  assert.equal(run('--strict', '--write').status, 1);
  assert.equal(fs.readFileSync(doc, 'utf8'), original);
  assert.equal(run('--write').status, 0);
  const updated = fs.readFileSync(doc, 'utf8');
  assert.notEqual(updated, original);
  assert.equal(run('--write').status, 0);
  assert.equal(fs.readFileSync(doc, 'utf8'), updated);
  fs.writeFileSync(path.join(dir, 'base_mainnet', 'Strategy.json'), '{broken');
  assert.equal(run('--write').status, 1);
  assert.equal(fs.readFileSync(doc, 'utf8'), updated);
});
