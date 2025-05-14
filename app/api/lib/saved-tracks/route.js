
import clientPromise from '../../lib/route';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
    try {
        const display_name = req.headers.get('x-display-name');
        const client = await clientPromise;
        const db = client.db('Dinjit');
        const tokenDoc = await db.collection('tokens').findOne({ display_name });

        if (!tokenDoc || !tokenDoc.access_token || Date.now() > tokenDoc.expiry) {
            return NextResponse.json({ error: 'Access token invalid or expired' }, { status: 401 });
        }

        const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
            headers: { Authorization: `Bearer ${tokenDoc.access_token}` },
        });

        const tracks = response.data.items.map((item) => item.track);
        return NextResponse.json(tracks);
    } catch (err) {
        console.error('Saved tracks fetch error:', err);
        return NextResponse.json({ error: 'Failed to load saved tracks' }, { status: 500 });
    }
}

