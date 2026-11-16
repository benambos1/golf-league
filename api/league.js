// League data API, stored as JSON files in Vercel Blob (no database).
//   GET  /api/league  -> latest published league JSON (404 if nothing published yet)
//   PUT  /api/league  -> publish new league JSON; requires header x-admin-pin = ADMIN_PIN
// Every publish is a new file, so the CDN never serves a stale copy. The last KEEP versions
// are kept as history; older ones are deleted.
import { put, list, del } from '@vercel/blob';

const PREFIX = 'league/';
const KEEP = 30;

async function versions() {
  const all = [];
  let cursor;
  do {
    const r = await list({ prefix: PREFIX, cursor, limit: 1000 });
    all.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return all.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
}

function valid(d) {
  return d && typeof d === 'object' && Array.isArray(d.players) && d.players.length === 8 &&
    Array.isArray(d.weeks) && Array.isArray(d.subs || []);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const [latest] = await versions();
      if (!latest) return res.status(404).json({ error: 'nothing published yet' });
      const r = await fetch(latest.url);
      if (!r.ok) throw new Error('blob fetch ' + r.status);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Published-At', new Date(latest.uploadedAt).toISOString());
      return res.status(200).send(await r.text());
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const pin = process.env.ADMIN_PIN;
      if (!pin || req.headers['x-admin-pin'] !== pin) return res.status(401).json({ error: 'wrong PIN' });
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const text = JSON.stringify(data);
      if (!valid(data) || text.length > 200000) return res.status(400).json({ error: 'not a valid league file' });
      const blob = await put(PREFIX + 'league.json', text, {
        access: 'public', addRandomSuffix: true, contentType: 'application/json',
      });
      const old = (await versions()).slice(KEEP);
      if (old.length) await del(old.map(b => b.url));
      return res.status(200).json({ ok: true, publishedAt: new Date().toISOString(), url: blob.url });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error('league api error', e);
    return res.status(500).json({ error: 'server error' });
  }
}
