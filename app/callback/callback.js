
// callback.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getTokens, getValidAccessToken, getUserPlaylists, getUserSavedTracks } from '../lib/spotify';
import PlaylistCard from '../components/PlaylistCard';
import TrackerList from '../components/TrackerList';

export default function Callback() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'playlists'; // default to playlists
  const code = searchParams.get('code');

  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function fetchData() {
      const code = searchParams.get('code');
      const tokenInStorage = localStorage.getItem('spotify_access_token');

      if (tokenInStorage) {
        // Token is in storage, proceed with loading data
        await loadData(tokenInStorage);
        return;
      }

      if (code) {
        try {
          const { access_token } = await getTokens(code);
          localStorage.setItem('spotify_access_token', access_token);
          window.history.replaceState({}, document.title, window.location.pathname);
          await loadData(access_token);
        } catch (err) {
          console.error('Error loading token:', err);
          setError('Failed to load token');
          setLoading(false);
        }
      } else {
        setError('No token or code available');
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  async function loadData(accessToken) {
    const token = await getValidAccessToken();
    if (!token) {
      setError('Token expired and refresh failed. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const userRes = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(userRes.data.id);

      const [userPlaylists, userTracks] = await Promise.all([
        getUserPlaylists(token),
        getUserSavedTracks(token),
      ]);

      setPlaylists(userPlaylists);
      setSavedTracks(userTracks);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load playlists or tracks');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <>
      <div className="p-6 bg-zinc-900 min-h-screen text-white">
        {tab === 'playlists' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-center text-zinc-400">
                <p>No playlists available. Please add playlists to your Spotify account.</p>
              </div>
            )}
          </>
        )}

        {tab === 'saved' && (
          <>
            {savedTracks.length > 0 ? (
              <TrackerList
                tracks={savedTracks}
                onPlay={(uri) =>
                  window.open(`https://open.spotify.com/track/${uri.split(':')[2]}`, '_blank')
                }
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-center text-zinc-400">
                <p>No saved tracks found. Please add tracks to your Spotify library.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}



















// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import {
//   getTokens,
//   getUserPlaylists,
//   getUserSavedTracks,
//   deletePlaylist,
//   deleteSavedTrack,
//   getValidAccessToken
// } from '../lib/spotify';
// import PlaylistCard from '../components/PlaylistCard';
// import TrackerList from '../components/TrackerList';

// export default function Callback() {
//   const searchParams = useSearchParams();
// const tab = searchParams.get('tab') || 'playlists'; // default to playlists

//   const code = searchParams.get('code');

//   const [loading, setLoading] = useState(true);
//   const [playlists, setPlaylists] = useState([]);
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [error, setError] = useState('');
//   const [userId, setUserId] = useState('');
//   useEffect(() => {
//   async function fetchData() {
//     const code = searchParams.get('code');
//     const tokenInStorage = localStorage.getItem('spotify_access_token');
//     if (tokenInStorage) {
//       await loadData(tokenInStorage);
//       return;
//     }
//     if (code) {
//       try {
//         const { access_token } = await getTokens(code);
//         localStorage.setItem('spotify_access_token', access_token);
//         window.history.replaceState({}, document.title, window.location.pathname);

//         await loadData(access_token);
//       } catch (err) {
//         console.error('Error loading token:', err);
//         setError('Failed to load token');
//         setLoading(false);
//       }
//     } else {
//       setError('No token or code available');
//       setLoading(false);
//     }
//   }

//   fetchData();
// }, [userId]);

// async function loadData() {
//   const token = await getValidAccessToken();
//   if (!token) {
//     setError('Token expired and refresh failed.');
//     setLoading(false);
//     return;
//   }

//   try {
//     const userRes = await axios.get('https://api.spotify.com/v1/me', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUserId(userRes.data.id);

//     const [userPlaylists, userTracks] = await Promise.all([
//       getUserPlaylists(token),
//       getUserSavedTracks(token),
//     ]);

//     setPlaylists(userPlaylists);
//     setSavedTracks(userTracks);
//   } catch (err) {
//     console.error('Error loading data:', err);
//     setError('Failed to load playlists or tracks');
//   } finally {
//     setLoading(false);
//   }
// }


//   const handleDelete = async (playlistId) => {
//     try {
//       const token = localStorage.getItem('spotify_access_token');
//       await deletePlaylist(token, playlistId);
//       setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
//     } catch (err) {
//       console.error('Failed to delete playlist:', err);
//     }
//   };

//   const handleTrackDelete = async (trackId) => {
//     try {
//       const token = localStorage.getItem('spotify_access_token');
//       await deleteSavedTrack(token, trackId);
//       setSavedTracks((prev) => prev.filter((track) => track.id !== trackId));
//     } catch (err) {
//       console.error('Failed to delete saved track:', err);
//     }
//   };

//   if (loading) return <p className="text-white p-4">Loading...</p>;
//   if (error) return <p className="text-red-500 p-4">{error}</p>;

//   return (

//     <>
//     <div className="p-6 bg-zinc-900 min-h-screen text-white">
//   {tab === 'playlists' && (
//     <>
//       <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
//       {playlists.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {playlists.map((playlist) => (
//             <PlaylistCard
//               key={playlist.id}
//               playlist={playlist}
//               handleDelete={handleDelete}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//           <p>No playlists available. Please add playlists to your Spotify account.</p>
//         </div>
//       )}
//     </>
//   )}

//   {tab === 'saved' && (
//     <>
//       {/* <h1 className="text-3xl font-bold mb-6">Your Saved Tracks</h1> */}
//       {savedTracks.length > 0 ? (
//         <TrackerList
//           tracks={savedTracks}
//           onPlay={(uri) =>
//             window.open(`https://open.spotify.com/track/${uri.split(':')[2]}`, '_blank')
//           }
//           onDelete={handleTrackDelete}
//         />
//       ) : (
//         <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//           <p>No saved tracks found. Please add tracks to your Spotify library.</p>
//         </div>
//       )}
//     </>
//   )}
// </div>

//     </>
//   );
// }

























// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import {
//   getTokens,
//   getUserPlaylists,
//   getUserSavedTracks,
//   deletePlaylist,
//   deleteSavedTrack,
// } from '../lib/spotify';
// import PlaylistCard from '../components/PlaylistCard';
// import TrackerList from '../components/TrackerList';

// export default function Callback() {
//   const searchParams = useSearchParams();
//   const code = searchParams.get('code');

//   const [loading, setLoading] = useState(true);
//   const [playlists, setPlaylists] = useState([]);
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [error, setError] = useState('');
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//   async function fetchData() {
//     const code = searchParams.get('code');
//     const tokenInStorage = localStorage.getItem('spotify_access_token');

//     // 1. Token exists: reuse it
//     if (tokenInStorage) {
//       await loadData(tokenInStorage);
//       return;
//     }

//     // 2. Code exists: exchange for token
//     if (code) {
//       try {
//         const { access_token } = await getTokens(code);
//         localStorage.setItem('spotify_access_token', access_token);
        
//         // Remove `code` from URL after successful token exchange
//         window.history.replaceState({}, document.title, window.location.pathname);

//         await loadData(access_token);
//       } catch (err) {
//         console.error('Error loading token:', err);
//         setError('Failed to load token');
//         setLoading(false);
//       }
//     } else {
//       setError('No token or code available');
//       setLoading(false);
//     }
//   }

//   fetchData();
// }, []);

// async function loadData(token) {
//   try {
//     const userRes = await axios.get('https://api.spotify.com/v1/me', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUserId(userRes.data.id);

//     const [userPlaylists, userTracks] = await Promise.all([
//       getUserPlaylists(token),
//       getUserSavedTracks(token),
//     ]);

//     setPlaylists(userPlaylists);
//     setSavedTracks(userTracks);
//   } catch (err) {
//     console.error('Error loading data:', err);
//     setError('Failed to load playlists or tracks');
//   } finally {
//     setLoading(false);
//   }
// }


// //   useEffect(() => {
// //     async function fetchData() {
// //       if (!code) return;

// //       try {
// //         const { access_token } = await getTokens(code);
// //         localStorage.setItem('spotify_access_token', access_token);

// //         const userRes = await axios.get('https://api.spotify.com/v1/me', {
// //           headers: { Authorization: `Bearer ${access_token}` },
// //         });
// //         setUserId(userRes.data.id);

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

//   const handleDelete = async (playlistId) => {
//     try {
//       const token = localStorage.getItem('spotify_access_token');
//       await deletePlaylist(token, playlistId);
//       setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
//     } catch (err) {
//       console.error('Failed to delete playlist:', err);
//     }
//   };

//   const handleTrackDelete = async (trackId) => {
//     try {
//       const token = localStorage.getItem('spotify_access_token');
//       await deleteSavedTrack(token, trackId);
//       setSavedTracks((prev) => prev.filter((track) => track.id !== trackId));
//     } catch (err) {
//       console.error('Failed to delete saved track:', err);
//     }
//   };

//   if (loading) return <p className="text-white p-4">Loading...</p>;
//   if (error) return <p className="text-red-500 p-4">{error}</p>;

//   return (
//     <div className="p-6 bg-zinc-900 min-h-screen text-white">
//       {playlists.length > 0 ? (
//         <>
//           <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {playlists.map((playlist) => (
//               <PlaylistCard
//                 key={playlist.id}
//                 playlist={playlist}
//                 handleDelete={handleDelete}
//               />
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//           <p>No playlists available. Please add playlists to your Spotify account.</p>
//         </div>
//       )}

//       {/* Saved Tracks */}
//       {savedTracks.length > 0 ? (
//         <div className="mt-12">
//           <TrackerList
//             tracks={savedTracks}
//             onPlay={(uri) =>
//               window.open(`https://open.spotify.com/track/${uri.split(':')[2]}`, '_blank')
//             }
//             onDelete={handleTrackDelete}
//           />
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-48 text-center text-zinc-400 mt-12">
//           <p>No saved tracks found. Please add tracks to your Spotify library.</p>
//         </div>
//       )}
//     </div>
//   );
// }



// export default function Callback() {
//   const searchParams = useSearchParams();
//   const code = searchParams.get('code');

//   const [loading, setLoading] = useState(true);
//   const [playlists, setPlaylists] = useState([]);
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchData() {
//       if (!code) return;

//       try {
//         const { access_token } = await getTokens(code);
//         localStorage.setItem('spotify_access_token', access_token);
//         console.log('Access Token:', access_token);

//         const [userPlaylists, userTracks] = await Promise.all([
//           getUserPlaylists(access_token),
//           getUserSavedTracks(access_token),
//         ]);

//         setPlaylists(userPlaylists);
//         setSavedTracks(userTracks);
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError('Failed to load playlists or tracks');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [code]);

//   if (loading) return <p className="text-white p-4">Loading...</p>;
//   if (error) return <p className="text-red-500 p-4">{error}</p>;

//   return (
//     <div className="p-6 bg-zinc-900 min-h-screen text-white">
//       {/* Playlists Section */}
//       <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
//       {playlists.length === 0 ? (
//         <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//           <p>No playlists available. Please add playlists to your Spotify account.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {playlists.map((playlist) => (
//             <PlaylistCard key={playlist.id} playlist={playlist} />
//           ))}
//         </div>
//       )}

//       {/* Saved Tracks Section */}
//       <div className="mt-12">
//         <h1 className="text-3xl font-bold mb-6">Your Saved Tracks</h1>
//         {savedTracks.length === 0 ? (
//           <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//             <p>No saved tracks found. Please add tracks to your Spotify library.</p>
//           </div>
//         ) : (
//           <ul className="space-y-4">
//             {savedTracks.map((track) => (
//               <li
//                 key={track.id}
//                 className="flex justify-between items-center bg-zinc-800 p-4 rounded"
//               >
//                 <div>
//                   <p className="text-lg">{track.name}</p>
//                   <p className="text-sm text-zinc-400">
//                     {track.artists.map((a) => a.name).join(', ')}
//                   </p>
//                 </div>
//                 <a
//                   href={track.external_urls.spotify}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
//                 >
//                   Play
//                 </a>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

