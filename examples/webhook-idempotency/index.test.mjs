import test from 'node:test';
import assert from 'node:assert/strict';
import { createWebhookProcessor } from './index.mjs';

const event = { tenantId: 'synthetic-tenant-a', eventId: 'evt-01', subscriptionId: 'sub-01', amountCents: 2500, currency: 'BRL' };

test('applies a new event and skips a sequential replay', async () => {
  let calls = 0;
  const process = createWebhookProcessor({ apply: async () => { calls++; return 'stored'; } });
  assert.deepEqual(await process(event), { applied: true, value: 'stored' });
  assert.deepEqual(await process(event), { applied: false, value: 'stored' });
  assert.equal(calls, 1);
});
test('concurrent replays share one operation', async () => {
  let calls = 0;
  const process = createWebhookProcessor({ apply: async () => { calls++; await new Promise(resolve => setImmediate(resolve)); return 'stored'; } });
  const results = await Promise.all(Array.from({ length: 12 }, () => process(event)));
  assert.equal(calls, 1);
  assert.equal(results.filter(r => r.applied).length, 1);
});
test('the same event ID is independent across tenants', async () => {
  let calls = 0;
  const process = createWebhookProcessor({ apply: async () => ++calls });
  await process(event);
  await process({ ...event, tenantId: 'synthetic-tenant-b' });
  assert.equal(calls, 2);
});
test('rejects conflicting payloads for an existing identity', async () => {
  const process = createWebhookProcessor({ apply: async () => 'stored' });
  await process(event);
  await assert.rejects(process({ ...event, amountCents: 9000 }), /Conflicting payload/);
});
test('a failed attempt can be retried', async () => {
  let calls = 0;
  const process = createWebhookProcessor({ apply: async () => { if (++calls === 1) throw new Error('temporary failure'); return 'stored'; } });
  await assert.rejects(process(event), /temporary failure/);
  assert.equal((await process(event)).applied, true);
  assert.equal(calls, 2);
});
test('invalid amounts do not trigger the business operation', async () => {
  let calls = 0;
  const process = createWebhookProcessor({ apply: async () => ++calls });
  for (const amountCents of [0, -5, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(process({ ...event, amountCents }), /positive safe integer/);
  }
  assert.equal(calls, 0);
});
test('invalid identity and currency are rejected', async () => {
  const process = createWebhookProcessor({ apply: async () => 'stored' });
  await assert.rejects(process({ ...event, tenantId: '' }), /tenantId/);
  await assert.rejects(process({ ...event, currency: 'USD' }), /BRL/);
});
test('tenant and event keys cannot collide through delimiters', async () => {
  let calls = 0;
  const process = createWebhookProcessor({ apply: async () => ++calls });
  await process({ ...event, tenantId: 'a:b', eventId: 'c' });
  await process({ ...event, tenantId: 'a', eventId: 'b:c' });
  assert.equal(calls, 2);
});
test('payload key order does not change the identity fingerprint', async () => {
  const process = createWebhookProcessor({ apply: async () => 'stored' });
  await process(event);
  const reordered = { currency: 'BRL', amountCents: 2500, subscriptionId: 'sub-01', eventId: 'evt-01', tenantId: 'synthetic-tenant-a' };
  assert.equal((await process(reordered)).applied, false);
});
