import { Request, Response, NextFunction } from 'express';

/**
 * Backward-compatibility shim for the `cost` -> `minimumBid` rename.
 *
 * The database field is unchanged (`minimumBid` is mapped to the stored `cost`),
 * but the JSON key the API emits would otherwise change from `cost` to
 * `minimumBid` and break existing clients — the web frontend reads
 * `tender.budget ?? tender.cost`.
 *
 * This walks outgoing JSON and mirrors `minimumBid` back onto `cost` wherever it
 * appears, so old and new clients both work. Remove once no client reads `cost`.
 */
const mirror = (value: unknown, seen = new WeakSet<object>()): unknown => {
  if (Array.isArray(value)) return value.map((v) => mirror(v, seen));
  if (value && typeof value === 'object') {
    if (seen.has(value as object)) return value;
    seen.add(value as object);
    const obj = value as Record<string, unknown>;
    if (typeof obj.minimumBid === 'number' && obj.cost === undefined) {
      obj.cost = obj.minimumBid;
    }
    for (const k of Object.keys(obj)) obj[k] = mirror(obj[k], seen);
  }
  return value;
};

export const legacyFields = (_req: Request, res: Response, next: NextFunction) => {
  const original = res.json.bind(res);
  res.json = (body: unknown) => original(mirror(body));
  next();
};

export default legacyFields;
