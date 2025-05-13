// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useSearchParams } from 'next/navigation';
// // import {
// //   getTokens,
// //   getUserPlaylists,
// //   getUserSavedTracks,
// // } from '../lib/spotify';
// // import PlaylistCard from '../components/PlaylistCard';

// // export default function Callback() {
// //   const searchParams = useSearchParams();
// //   const code = searchParams.get('code');

// //   const [loading, setLoading] = useState(true);
// //   const [playlists, setPlaylists] = useState([]);
// //   const [savedTracks, setSavedTracks] = useState([]);
// //   const [error, setError] = useState('');
  

// //   useEffect(() => {
// //     async function fetchData() {
// //       if (!code) return;

// //       try {
// //         const { access_token } = await getTokens(code);
// //         localStorage.setItem('spotify_access_token', access_token);
// //         console.log('Access Token:', access_token);

// //         const [userPlaylists, userTracks] = await Promise.all([
// //           getUserPlaylists(access_token),
// //           getUserSavedTracks(access_token),
// //         ]);

// //         setPlaylists(userPlaylists);
// //         setSavedTracks(userTracks);
// //       } catch (err) {
// //         console.error('Error loading data:', err);
// //         setError('Failed to load playlists or tracks');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchData();
// //   }, [code]);

// //   if (loading) return <p className="text-white p-4">Loading...</p>;
// //   if (error) return <p className="text-red-500 p-4">{error}</p>;

// //   return (
// //     <div className="p-6 bg-zinc-900 min-h-screen text-white">
// //       {/* Playlists */}
// //       <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// //         {playlists.map((playlist) => (
// //           <PlaylistCard key={playlist.id} playlist={playlist} />
// //         ))}
// //       </div>

// //       {/* Saved Tracks */}
// //       <div className="mt-12">
// //         <h1 className="text-3xl font-bold mb-6">Your Saved Tracks</h1>
// //         <ul className="space-y-4">
// //           {savedTracks.map((track) => (
// //             <li
// //               key={track.id}
// //               className="flex justify-between items-center bg-zinc-800 p-4 rounded"
// //             >
// //               <div>
// //                 <p className="text-lg">{track.name}</p>
// //                 <p className="text-sm text-zinc-400">
// //                   {track.artists.map((a) => a.name).join(', ')}
// //                 </p>
// //               </div>
// //               <a
// //                 href={track.external_urls.spotify}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
// //               >
// //                 Play
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import {
//   getTokens,
//   getValidAccessToken,
//   getUserPlaylists,
//   getUserSavedTracks,
// } from '../lib/spotify';
// import PlaylistCard from '../components/PlaylistCard';

// export default function Callback() {
//   const searchParams = useSearchParams();
//   const code = searchParams.get('code');
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [playlists, setPlaylists] = useState([]);
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // First login with code
//         if (code) {
//           const tokens = await getTokens(code);
//           localStorage.setItem('spotify_access_token', tokens.access_token);
//           localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
//           localStorage.setItem('spotify_token_expires_at', Date.now() + tokens.expires_in * 1000);

//           router.replace('/'); 
//           return;
//         }
//         const accessToken = await getValidAccessToken();
//         const [userPlaylists, userTracks] = await Promise.all([
//           getUserPlaylists(accessToken),
//           getUserSavedTracks(accessToken),
//         ]);

//         setPlaylists(userPlaylists);
//         setSavedTracks(userTracks);
//       } catch (err) {
//         console.error('❌ Error:', err);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [code, router]);

//   if (loading) return <p className="text-white p-4">Loading...</p>;
//   if (error) return <p className="text-red-500 p-4">{error}</p>;

//   return (
//     <div className="p-6 bg-zinc-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {playlists.map((playlist) => (
//           <PlaylistCard key={playlist.id} playlist={playlist} />
//         ))}
//       </div>

//       <div className="mt-12">
//         <h1 className="text-3xl font-bold mb-6">Your Saved Tracks</h1>
//         <ul className="space-y-4">
//           {savedTracks.map((track) => (
//             <li
//               key={track.id}
//               className="flex justify-between items-center bg-zinc-800 p-4 rounded"
//             >
//               <div>
//                 <p className="text-lg">{track.name}</p>
//                 <p className="text-sm text-zinc-400">
//                   {track.artists.map((a) => a.name).join(', ')}
//                 </p>
//               </div>
//               <a
//                 href={track.external_urls.spotify}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
//               >
//                 Play
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getTokens,
  getValidAccessToken,
  getUserPlaylists,
  getUserSavedTracks,
} from '../lib/spotify';
import PlaylistCard from '../components/PlaylistCard';

export default function Callback() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [error, setError] = useState('');

  // Fetch initial data and store tokens
  useEffect(() => {
    async function initialize() {
      try {
        if (code) {
          const tokens = await getTokens(code);
          localStorage.setItem('spotify_access_token', tokens.access_token);
          localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
          localStorage.setItem(
            'spotify_token_expires_at',
            Date.now() + tokens.expires_in * 1000
          );
          router.replace('/');
          return;
        }

        await fetchPlaylistsAndTracks(); 
        setLoading(false);
      } catch (err) {
        console.error('❌ Error during auth or initial fetch:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    }

    initialize();
  }, [code, router]);

  // Periodically refresh playlists
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlaylistsAndTracks();
    }, 60000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Reusable fetch function
  async function fetchPlaylistsAndTracks() {
    try {
      const accessToken = await getValidAccessToken();
      const [userPlaylists, userTracks] = await Promise.all([
        getUserPlaylists(accessToken),
        getUserSavedTracks(accessToken),
      ]);
      setPlaylists(userPlaylists);
      setSavedTracks(userTracks);
    } catch (err) {
      console.error('❌ Failed to fetch updated data:', err);
      setError(err.message || 'Could not refresh data');
    }
  }

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      <div className="mt-12">
        <h1 className="text-3xl font-bold mb-6">Your Saved Tracks</h1>
        <ul className="space-y-4">
          {savedTracks.map((track) => (
            <li
              key={track.id}
              className="flex justify-between items-center bg-zinc-800 p-4 rounded"
            >
              <div>
                <p className="text-lg">{track.name}</p>
                <p className="text-sm text-zinc-400">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </div>
              <a
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
              >
                Play
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
