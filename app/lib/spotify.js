"use client"

import axios from 'axios';
import querystring from 'querystring';
const CLIENT_ID = "6d1981aa070447e4b1f671caa709dcdd"
const CLIENT_SECRET = "8c8429d8683a4ef29cfc9ce171376aac";
const REDIRECT_URI = "https://spotify-lac-ten.vercel.app/callback";
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

