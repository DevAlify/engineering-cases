import { createHash } from 'node:crypto';

/** Educational single-process deduplication. It is not production payment code. */
export function createWebhookProcessor({ apply }) {
  if (typeof apply !== 'function') throw new TypeError('apply must be a function');
  const events = new Map();

  return async function processEvent(input) {
    if (!input || typeof input !== 'object') throw new TypeError('event must be an object');
    for (const field of ['tenantId', 'eventId', 'subscriptionId']) {
      if (typeof input[field] !== 'string' || !input[field].trim() || input[field].length > 200) {
        throw new TypeError(`${field} must be a non-empty string of at most 200 characters`);
      }
    }
    if (!Number.isSafeInteger(input.amountCents) || input.amountCents <= 0) throw new TypeError('amountCents must be a positive safe integer');
    if (input.currency !== 'BRL') throw new TypeError('only synthetic BRL events are supported');

    const event = Object.freeze({
      tenantId: input.tenantId, eventId: input.eventId, subscriptionId: input.subscriptionId,
      amountCents: input.amountCents, currency: input.currency,
    });
    const key = JSON.stringify([event.tenantId, event.eventId]);
    const fingerprint = createHash('sha256').update(JSON.stringify({
      subscriptionId: event.subscriptionId, amountCents: event.amountCents, currency: event.currency,
    })).digest('hex');
    const previous = events.get(key);
    if (previous) {
      if (previous.fingerprint !== fingerprint) throw new Error('Conflicting payload for the same event identity');
      return { applied: false, value: await previous.promise };
    }

    // Register before yielding so concurrent calls share the same in-flight operation.
    const record = { fingerprint, promise: Promise.resolve().then(() => apply(event)) };
    events.set(key, record);
    try {
      return { applied: true, value: await record.promise };
    } catch (error) {
      if (events.get(key) === record) events.delete(key);
      throw error;
    }
  };
}
