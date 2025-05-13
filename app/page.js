// 'use client';

// import { getLoginUrl } from '../app/lib/spotify';

// export default function Home() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
//       <h1 className="text-4xl font-bold mb-6">Spotify Homepage Clone</h1>
//       <a
//         href={getLoginUrl()}
//         className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
//       >
//         Log in with Spotify
//       </a>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { getLoginUrl } from './lib/spotify';
import { getUserSavedTracks } from './lib/spotify';
import TrackCard from './components/TrackCard';

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    async function fetchTracks() {
      try {
        const savedTracks = await getUserSavedTracks(token);
        setTracks(savedTracks);
      } catch (err) {
        console.error('Error loading tracks:', err);
        setError('Failed to load favorite tracks');
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();
  }, []);

  if (loading) {
    return <p className="text-white p-4">Loading...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-4xl font-bold mb-6">Spotify Homepage Clone</h1>
        <a
          href={getLoginUrl()}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
        >
          Log in with Spotify
        </a>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">ఇష్టమైన పాటలు</h1>
      <ul className="space-y-4">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </ul>
    </div>
  );
}
