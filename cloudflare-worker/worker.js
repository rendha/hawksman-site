/**
 * Hawksman "See it made" AI preview — Cloudflare Worker (free plan)
 *
 * The website sends the customer's design as a prompt plus two reference images
 * (the cloth preview and the fabric swatch). This Worker asks Workers AI
 * (FLUX.2 [klein] 4B) for a photo-realistic image and returns it as base64.
 *
 * Needs one binding: Workers AI, named AI (Settings → Bindings → Add → Workers AI).
 * On the Workers Free plan usage stops at the daily allowance, so it can never bill you.
 */

const MODEL = '@cf/black-forest-labs/flux-2-klein-4b';
// Websites allowed to use this preview. Add your own domain here if you buy one.
const ALLOWED_ORIGINS = ['https://rendha.github.io'];
const MAX_IMAGE_BYTES = 400_000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const cors = { 'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0], 'Vary': 'Origin' };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }
    if (request.method !== 'POST') return json({ error: 'Send a POST request.' }, 405, cors);
    if (!allowed) return json({ error: 'This website is not allowed to use the preview.' }, 403, cors);

    let incoming;
    try { incoming = await request.formData(); } catch { return json({ error: 'Expected form data.' }, 400, cors); }
    const prompt = String(incoming.get('prompt') || '').slice(0, 1800);
    if (!prompt) return json({ error: 'Missing prompt.' }, 400, cors);

    const form = new FormData();
    form.append('prompt', prompt);
    form.append('width', '768');
    form.append('height', '960');
    const seed = Number(incoming.get('seed'));
    if (Number.isInteger(seed) && seed >= 0) form.append('seed', String(seed));
    for (let i = 0; i < 2; i++) {
      const img = incoming.get(`input_image_${i}`);
      if (img && typeof img !== 'string' && img.size > 0 && img.size <= MAX_IMAGE_BYTES) form.append(`input_image_${i}`, img);
    }

    // FormData has to go through a Response to get its multipart body and boundary
    const body = new Response(form);
    try {
      const out = await env.AI.run(MODEL, { multipart: { body: body.body, contentType: body.headers.get('content-type') } });
      if (!out || !out.image) return json({ error: 'failed', detail: 'No image returned.' }, 502, cors);
      return json({ image: out.image }, 200, cors);
    } catch (err) {
      const detail = String((err && err.message) || err).slice(0, 300);
      const limit = /neuron|limit|quota|429|exceed/i.test(detail);
      return json({ error: limit ? 'limit' : 'failed', detail }, limit ? 429 : 502, cors);
    }
  }
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}
