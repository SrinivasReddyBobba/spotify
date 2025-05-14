import axios from 'axios';
import clientPromise from '../lib/route';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("Dinjit");
    const tokenData = await db.collection('tokens').findOne({ userId: { $exists: true } });

    if (!tokenData?.refresh_token) return res.status(401).json({ error: 'No refresh token found' });

    try {
        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokenData.refresh_token,
        }).toString();

        const response = await axios.post('https://accounts.spotify.com/api/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
            },
        });

        const newAccessToken = response.data.access_token;
        const expiry = Date.now() + response.data.expires_in * 1000;

        await db.collection('tokens').updateOne(
            { user: 'default' },
            { $set: { access_token: newAccessToken, expiry } }
        );

        res.status(200).json({ access_token: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
}
