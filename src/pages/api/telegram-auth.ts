import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN!;

function checkSignature(data: any) {
  const { hash, ...rest } = data;
  const dataCheckString = Object.keys(rest)
    .sort()
    .map(key => `${key}=${rest[key]}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return hmac === hash;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.query;
  if (!checkSignature(data)) {
    return res.status(403).send('Invalid signature');
  }
  res.redirect('/dashboard');
} 