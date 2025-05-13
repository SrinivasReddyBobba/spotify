'use client';
import querystring from 'query-string';
import axios from 'axios';

const CLIENT_ID = '6d1981aa070447e4b1f671caa709dcdd';
const CLIENT_SECRET = '8c8429d8683a4ef29cfc9ce171376aac';
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
// const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
// const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
// const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export async function getValidAccessToken() {
  const accessToken = localStorage.getItem('spotify_access_token');
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const expiresAt = parseInt(localStorage.getItem('spotify_token_expires_at'), 10);

  if (accessToken && Date.now() < expiresAt) {
    return accessToken;
  }

  if (refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    localStorage.setItem('spotify_access_token', refreshed.access_token);
    localStorage.setItem('spotify_token_expires_at', Date.now() + refreshed.expires_in * 1000);
    return refreshed.access_token;
  }

  throw new Error('No valid token. Please log in again.');
}


export function getLoginUrl() {
  const query = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'user-read-private playlist-read-private playlist-read-collaborative',
  });

  return `https://accounts.spotify.com/authorize?${query}`;
}

export async function getTokens(code) {
  const body = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });
 console.log(code,"code")
  const response = await axios.post('https://accounts.spotify.com/api/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
  });
console.log(response,"test")
  return response.data;
}

export async function refreshAccessToken(refreshToken) {
  const body = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await axios.post('https://accounts.spotify.com/api/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
  });

  return response.data;
}

// export async function getUserPlaylists(accessToken) {
//   const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   console.log(response.data.items,"tt")
//   return response.data.items;
// }

export async function getUserPlaylists(accessToken) {
  let playlists = [];
  let url = 'https://api.spotify.com/v1/me/playlists?limit=50'; // max 50 per request

  while (url) {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    playlists = playlists.concat(response.data.items);
    url = response.data.next; // if null, loop stops
  }

  console.log('Total playlists:', playlists.length);
  return playlists;
}

export async function getUserSavedTracks(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.items.map(item => item.track);
}

// 'use client';
// import querystring from 'query-string';
// import axios from 'axios';

// const CLIENT_ID = "6d1981aa070447e4b1f671caa709dcdd"
// const CLIENT_SECRET = "8c8429d8683a4ef29cfc9ce171376aac";
// const REDIRECT_URI = "http://127.0.0.1:3000/callback";
// console.log(REDIRECT_URI,"UTL")
// console.log(CLIENT_SECRET,"1234")

// export function getLoginUrl() {
//   const query = querystring.stringify({
//     client_id: CLIENT_ID,
//     response_type: 'code',
//     redirect_uri: REDIRECT_URI,
//     scope: "user-read-private playlist-read-private playlist-read-collaborative",
//   });

//   return `https://accounts.spotify.com/authorize?${query}`;
// }

// export async function getTokens(code) {
//   const body = querystring.stringify({
//     grant_type: 'authorization_code',
//     code,
//     redirect_uri: REDIRECT_URI,
//   });

//   try {
//     const response = await axios.post('https://accounts.spotify.com/api/token', body, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
//       },
//     });

//     console.log('Token response:', response.data);
//     return response.data;
//   } catch (err) {
//     console.error('❌ Error fetching tokens:', err.response?.data || err.message);
//     throw new Error('Failed to get tokens');
//   }
// }


// export async function getUserPlaylists(accessToken) {
//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data.items;
//   } catch (error) {
//     console.error('❌ Failed to fetch playlists:', error.response?.data || error.message);
//     throw new Error('Failed to load playlists');
//   }
// }

// export async function getUserSavedTracks(accessToken) {
//   const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   return response.data.items.map(item => item.track);
// }
