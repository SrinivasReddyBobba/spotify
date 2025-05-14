


import clientPromise from './../lib/route';
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export async function POST(req) {
  const { code } = await req.json();

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  }).toString();

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body,
    });

    const tokenData = await tokenRes.json();
    console.log(tokenData,"data")
    const { access_token, refresh_token, expires_in } = tokenData;
    const expiry = Date.now() + expires_in * 1000;
   const userRes = await fetch('https://api.spotify.com/v1/me', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});
console.log(tokenData,"uiuiuiu")
if (!userRes.ok) {
  const errorData = await userRes.json();
  console.error('Error fetching user data:', errorData);
  throw new Error(`Spotify API Error: ${errorData.error.message}`);
}

const userData = await userRes.json();
console.log(userData,"userback")
const { id, display_name, email } = userData;
console.log('Logged in:', display_name);

    const client = await clientPromise;
    const db = client.db('Dinjit');

    await db.collection('tokens').updateOne(
      { userId: id },
      {
        $set: {
          userId: id,
          display_name,
          email,
          access_token,
          refresh_token,
          expiry,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, display_name });

  } catch (err) {
    console.error('Token/User fetch error:', err);
    return NextResponse.json({ error: 'Failed to get token or user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('Dinjit');

    // NOTE: Replace 'default' with real userId if tracking multiple users
    const tokenDoc = await db.collection('tokens').findOne({ userId: { $exists: true } });

    if (!tokenDoc || !tokenDoc.access_token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    if (Date.now() > tokenDoc.expiry) {
      return NextResponse.json({ error: 'Access token expired' }, { status: 401 });
    }

    return NextResponse.json({
      accessToken: tokenDoc.access_token,
      displayName: tokenDoc.display_name || '',
    });
  } catch (err) {
    console.error('Token fetch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}



// File: app/api/authtoken/route.js
// import axios from 'axios';
// import clientPromise from './../lib/route'
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db('Dinjit');
//     const tokenDoc = await db.collection('tokens').findOne({ user: 'default' });

//     if (!tokenDoc || !tokenDoc.access_token) {
//       return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
//     }

//     if (Date.now() > tokenDoc.expiry) {
//       return NextResponse.json({ error: 'Access token expired' }, { status: 401 });
//     }

//     return NextResponse.json({ accessToken: tokenDoc.access_token });
//   } catch (err) {
//     console.error('Token fetch error:', err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   const { code } = await req.json();
//   const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
//   const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
//   const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

//   const body = new URLSearchParams({
//     grant_type: 'authorization_code',
//     code,
//     redirect_uri: REDIRECT_URI,
//   }).toString();

//   try {
//     const res = await fetch('https://accounts.spotify.com/api/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
//       },
//       body,
//     });

//     const data = await res.json();
//     const { access_token, refresh_token, expires_in } = data;
//     const expiry = Date.now() + expires_in * 1000;

//     const client = await clientPromise;
//     const db = client.db('Dinjit');
//     await db.collection('tokens').updateOne(
//       { user: 'default' },
//       { $set: { access_token, refresh_token, expiry } },
//       { upsert: true }
//     );

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error('Token exchange error:', err);
//     return NextResponse.json({ error: 'Failed to get token' }, { status: 500 });
//   }
// }
