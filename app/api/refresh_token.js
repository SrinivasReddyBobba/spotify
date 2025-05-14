// /pages/api/refresh_token.js
export default async function handler(req, res) {
  const refresh_token = req.cookies.spotify_refresh_token;

  const CLIENT_ID = "6d1981aa070447e4b1f671caa709dcdd"
const CLIENT_SECRET = "8c8429d8683a4ef29cfc9ce171376aac";

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
  console.log(data,"data")
}
