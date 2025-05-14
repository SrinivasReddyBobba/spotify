"use client"

import axios from 'axios';
import querystring from 'querystring';
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
  "playlist-modify-private",
 " user-read-email" 

].join(" "),

  });

  return `https://accounts.spotify.com/authorize?${query}`;
}

// export async function getAccessTokenFromServer() {
//   const res = await fetch('/api/authtokenrefresh');
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error);
//   return data.access_token;
// }

// export async function getUserPlaylists(accessToken) {
//   const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   return res.data.items;
// }

// export async function getUserSavedTracks(accessToken) {
//   const res = await axios.get('https://api.spotify.com/v1/me/tracks', {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
//   return res.data.items.map((item) => item.track);
// }

// export async function deletePlaylist(accessToken, playlistId) {
//   await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//     headers: { Authorization: `Bearer ${accessToken}` },
//   });
// }

// export async function deleteSavedTrack(accessToken, trackId) {
//   await axios.delete('https://api.spotify.com/v1/me/tracks', {
//     headers: { Authorization: `Bearer ${accessToken}` },
//     data: { ids: [trackId] },
//   });
// }


// 'use client';
// import querystring from 'query-string';
// import axios from 'axios';

// const CLIENT_ID = "6d1981aa070447e4b1f671caa709dcdd"
// const CLIENT_SECRET = "8c8429d8683a4ef29cfc9ce171376aac";
// const REDIRECT_URI = "https://spotify-lac-ten.vercel.app/callback";
// export function getLoginUrl() {
//   const query = querystring.stringify({
//     client_id: CLIENT_ID,
//     response_type: 'code',
//     redirect_uri: REDIRECT_URI,
//  scope: [
//   "user-read-private",
//   "playlist-read-private",
//   "playlist-read-collaborative",
//   "user-library-read",
//   'user-library-modify',
//   "playlist-modify-public",
//   "playlist-modify-private"
// ].join(" "),

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

//     const { access_token, refresh_token, expires_in } = response.data;

//     localStorage.setItem('spotify_access_token', access_token);
//     localStorage.setItem('spotify_refresh_token', refresh_token);
//     localStorage.setItem('spotify_token_expiry', (Date.now() + expires_in * 1000).toString());

//     return response.data;
//   } catch (err) {
//     console.error('❌ Error fetching tokens:', err.response?.data || err.message);
//     throw new Error('Failed to get tokens');
//   }
// }
// export async function getValidAccessToken() {
//   const accessToken = localStorage.getItem('spotify_access_token');
//   const refreshToken = localStorage.getItem('spotify_refresh_token');
//   const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);

//   // If no access or refresh token, return null
//   if (!accessToken || !refreshToken) {
//     console.error('No access or refresh token available');
//     return null;
//   }

//   // If the access token is still valid, return it
//   if (Date.now() < expiry) {
//     console.log('Access token is valid');
//     return accessToken;
//   }

//   // Token expired, attempting to refresh the access token
//   try {
//     console.log('Refreshing access token...');
//     const body = querystring.stringify({
//       grant_type: 'refresh_token',
//       refresh_token: refreshToken,
//     });

//     const response = await axios.post('https://accounts.spotify.com/api/token', body, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
//       },
//     });

//     const newAccessToken = response.data.access_token;
//     const expiresIn = response.data.expires_in;

//     // Save the new access token and expiry time
//     localStorage.setItem('spotify_access_token', newAccessToken);
//     localStorage.setItem('spotify_token_expiry', (Date.now() + expiresIn * 1000).toString());

//     console.log('Access token refreshed successfully');
//     return newAccessToken;
//   } catch (error) {
//     console.error('Failed to refresh access token:', error.response?.data || error.message);

//     // If refresh token is invalid or expired, prompt user to log in again
//     if (error.response?.data?.error_description === 'invalid_grant') {
//       console.log('Refresh token expired or invalid, prompting user to log in again');
//       localStorage.removeItem('spotify_access_token');
//       localStorage.removeItem('spotify_refresh_token');
//       localStorage.removeItem('spotify_token_expiry');
//       return null;
//     }

//     // If other errors occur, return null
//     return null;
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
//     console.error(' Failed to fetch playlists:', error.response?.data || error.message);
//     throw new Error('Failed to load playlists');
//   }
// }
// export async function deletePlaylist(accessToken, playlistId) {
//   try {
//     await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     console.log('Playlist unfollowed successfully');
//   } catch (error) {
//     console.error('Error unfollowing playlist:', error.response?.data || error.message);
//     throw new Error('Failed to unfollow playlist');
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


// export async function deleteSavedTrack(accessToken, trackId) {
//   try {
//     await axios.delete(`https://api.spotify.com/v1/me/tracks`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       data: {
//         ids: [trackId],
//       },
//     });
//   } catch (error) {
//     const message =
//       error.response?.data?.error?.message ||
//       error.response?.data ||
//       error.message ||
//       'Unknown error';
//     console.error('Error deleting saved track:', message);
//     throw new Error(message);
//   }
// }










// 'use client';
// import querystring from 'query-string';
// import axios from 'axios';

// const CLIENT_ID = "6d1981aa070447e4b1f671caa709dcdd"
// const CLIENT_SECRET = "8c8429d8683a4ef29cfc9ce171376aac";
// const REDIRECT_URI = "https://spotify-lac-ten.vercel.app/callback";
// export function getLoginUrl() {
//   const query = querystring.stringify({
//     client_id: CLIENT_ID,
//     response_type: 'code',
//     redirect_uri: REDIRECT_URI,
//  scope: [
//   "user-read-private",
//   "playlist-read-private",
//   "playlist-read-collaborative",
//   "user-library-read",
//   'user-library-modify',
//   "playlist-modify-public",
//   "playlist-modify-private"
// ].join(" "),

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

//     const { access_token, refresh_token, expires_in } = response.data;

//     localStorage.setItem('spotify_access_token', access_token);
//     localStorage.setItem('spotify_refresh_token', refresh_token);
//     localStorage.setItem('spotify_token_expiry', (Date.now() + expires_in * 1000).toString());

//     return response.data;
//   } catch (err) {
//     console.error('❌ Error fetching tokens:', err.response?.data || err.message);
//     throw new Error('Failed to get tokens');
//   }
// }


// export async function getValidAccessToken() {
//   const accessToken = localStorage.getItem('spotify_access_token');
//   const refreshToken = localStorage.getItem('spotify_refresh_token');
//   const expiry = parseInt(localStorage.getItem('spotify_token_expiry'), 10);

//   if (!accessToken || !refreshToken) return null;

//   if (Date.now() < expiry) {
//     return accessToken;
//   }

//   // Refresh token
//   try {
//     const body = querystring.stringify({
//       grant_type: 'refresh_token',
//       refresh_token: refreshToken,
//     });

//     const response = await axios.post('https://accounts.spotify.com/api/token', body, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
//       },
//     });

//     const newAccessToken = response.data.access_token;
//     const expiresIn = response.data.expires_in;

//     localStorage.setItem('spotify_access_token', newAccessToken);
//     localStorage.setItem('spotify_token_expiry', (Date.now() + expiresIn * 1000).toString());

//     return newAccessToken;
//   } catch (error) {
//     console.error('🔁 Failed to refresh access token:', error.response?.data || error.message);
//     return null;
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
//     console.error(' Failed to fetch playlists:', error.response?.data || error.message);
//     throw new Error('Failed to load playlists');
//   }
// }
// export async function deletePlaylist(accessToken, playlistId) {
//   try {
//     await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     console.log('Playlist unfollowed successfully');
//   } catch (error) {
//     console.error('Error unfollowing playlist:', error.response?.data || error.message);
//     throw new Error('Failed to unfollow playlist');
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


// export async function deleteSavedTrack(accessToken, trackId) {
//   try {
//     await axios.delete(`https://api.spotify.com/v1/me/tracks`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       data: {
//         ids: [trackId],
//       },
//     });
//   } catch (error) {
//     const message =
//       error.response?.data?.error?.message ||
//       error.response?.data ||
//       error.message ||
//       'Unknown error';
//     console.error('Error deleting saved track:', message);
//     throw new Error(message);
//   }
// }
