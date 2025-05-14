// lib/spotify/getUserProfile.js

export async function getUserProfile(access_token) {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log(errorData,"erfr")
    console.error('Error fetching user data:', errorData);
    throw new Error(`Spotify API Error: ${errorData.error.message}`);
  }

  return res.json();
}
