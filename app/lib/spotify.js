
'use client';
import querystring from 'query-string';
import axios from 'axios';

const CLIENT_ID = "6d1981aa070447e4b1f671caa709dcdd"
const CLIENT_SECRET = "8c8429d8683a4ef29cfc9ce171376aac";
const REDIRECT_URI = "http://127.0.0.1:3000/callback";
export function getLoginUrl() {
  const query = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
 scope: [
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  'user-library-modify',
  "playlist-modify-public",
  "playlist-modify-private"
].join(" "),

  });

  return `https://accounts.spotify.com/authorize?${query}`;
}


export async function getTokens(code) {
  const body = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
    });

    console.log('Token response:', response.data);
    return response.data;
  } catch (err) {
    console.error('❌ Error fetching tokens:', err.response?.data || err.message);
    throw new Error('Failed to get tokens');
  }
}


export async function getUserPlaylists(accessToken) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(' Failed to fetch playlists:', error.response?.data || error.message);
    throw new Error('Failed to load playlists');
  }
}
export async function deletePlaylist(accessToken, playlistId) {
  try {
    await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Playlist unfollowed successfully');
  } catch (error) {
    console.error('Error unfollowing playlist:', error.response?.data || error.message);
    throw new Error('Failed to unfollow playlist');
  }
}


export async function getUserSavedTracks(accessToken) {
  const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.items.map(item => item.track);
}


export async function deleteSavedTrack(accessToken, trackId) {
  try {
    await axios.delete(`https://api.spotify.com/v1/me/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        ids: [trackId],
      },
    });
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data ||
      error.message ||
      'Unknown error';
    console.error('Error deleting saved track:', message);
    throw new Error(message);
  }
}
