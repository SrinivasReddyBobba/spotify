// File: app/api/spotify/playlists/route.js
// import { NextResponse } from 'next/server';
// import clientPromise from '../../lib/route';
// import axios from 'axios';

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db('Dinjit');
//     const tokenDoc = await db.collection('tokens').findOne({ 
// display_name: 'Srinivasareddy' });
//   console.log(tokenDoc,"pp")
//     if (!tokenDoc || !tokenDoc.access_token || Date.now() > tokenDoc.expiry) {
//       return NextResponse.json({ error: 'Access token invalid or expired' }, { status: 401 });
//     }

//     const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
//       headers: { Authorization: `Bearer ${tokenDoc.access_token}` },
//     });
//     console.log(response.data.items,"playbackend")
//     return NextResponse.json(response.data.items);
//   } catch (err) {
//     console.error('Playlists fetch error:', err);
//     return NextResponse.json({ error: 'Failed to load playlists' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import clientPromise from '../../lib/route';
import axios from 'axios';

export async function GET(req) {
  try {
    const display_name = req.headers.get('x-display-name'); // custom header
    if (!display_name) {
      return NextResponse.json({ error: 'Missing display name' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Dinjit');

    const tokenDoc = await db.collection('tokens').findOne({ display_name });

    if (!tokenDoc || !tokenDoc.access_token || Date.now() > tokenDoc.expiry) {
      return NextResponse.json({ error: 'Access token invalid or expired' }, { status: 401 });
    }

    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${tokenDoc.access_token}`,
      },
    });

    return NextResponse.json(response.data.items);
  } catch (err) {
    console.error('Playlists fetch error:', err);
    return NextResponse.json({ error: 'Failed to load playlists' }, { status: 500 });
  }
}
