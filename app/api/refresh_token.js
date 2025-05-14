// /pages/api/refresh_token.js
export default async function handler(req, res) {
  const refresh_token = req.cookies.spotify_refresh_token;

  const clientId = "6d1981aa070447e4b1f671caa709dcdd"
const clientSecret = "8c8429d8683a4ef29cfc9ce171376aac";

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  res.status(200).json(data); 
  console.log(data,"data")
}
