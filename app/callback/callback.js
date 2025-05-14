// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import PlaylistCard from "../components/PlaylistCard";
// import TrackerList from "../components/TrackerList";

// export default function Callback() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const tab = searchParams.get("tab") || "playlists";
//   const code = searchParams.get("code");

//   const [loading, setLoading] = useState(true);
//   const [playlists, setPlaylists] = useState([]);
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function authenticateAndFetch() {
//       if (!code) {
//         setError("Authorization code not found.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         // Exchange code for tokens and set session cookie
//         const tokenRes = await fetch("/api/authtoken", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ code }),
//         });

//         const data = await tokenRes.json();
//         console.log(data,"data")

//         if (!tokenRes.ok || !data.success) {
//           setError(data.error || "Failed to authenticate with Spotify.");
//           setLoading(false);
//           return;
//         }

//         // Clean up URL (remove code param)
//         router.replace("/callback?tab=" + tab);

//         // Now fetch playlists and saved tracks after successful authentication
//         const accessTokenRes = await fetch("/api/authtoken");
//         const { accessToken } = await accessTokenRes.json();

//         if (!accessToken) {
//           throw new Error("Missing access token");
//         }

//         const [playlistRes, savedTrackRes] = await Promise.all([
//           fetch("/api/lib/playlist"),
//         //   fetch("/api/lib/saved-tracks"),
//         ]);

//         const playlistsData = await playlistRes.json();
//         console.log(playlistsData,"hello")
//         // const savedTracksData = await savedTrackRes.json();

//         setPlaylists(playlistsData);

//         // setSavedTracks(savedTracksData);
//       } catch (err) {
//         console.error("Error:", err);
//         setError("Authentication failed or Spotify API error");
//       } finally {
//         setLoading(false);
//       }
//     }

//     authenticateAndFetch();
//   }, [code, tab, router,playlists]);

//   const handleDeletePlaylist = async (id) => {
//     try {
//       await fetch(`/api/spotify/playlists/${id}`, { method: "DELETE" });
//       setPlaylists((prev) => prev.filter((p) => p.id !== id));
//     } catch (err) {
//       console.error("Error deleting playlist:", err);
//     }
//   };

//   const handleDeleteTrack = async (id) => {
//     try {
//       await fetch(`/api/spotify/saved-tracks/${id}`, { method: "DELETE" });
//       setSavedTracks((prev) => prev.filter((track) => track.id !== id));
//     } catch (err) {
//       console.error("Error deleting track:", err);
//     }
//   };

//   if (loading) return <p className="text-white p-4">Loading...</p>;
//   if (error) return <p className="text-red-500 p-4">{error}</p>;

//   return (
//     <div className="p-6 bg-zinc-900 min-h-screen text-white">
//       <div className="flex space-x-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded ${tab === "playlists" ? "bg-green-600" : "bg-zinc-700"}`}
//           onClick={() => router.push("/callback?tab=playlists")}
//         >
//           Playlists
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${tab === "saved" ? "bg-green-600" : "bg-zinc-700"}`}
//           onClick={() => router.push("/callback?tab=saved")}
//         >
//           Saved Tracks
//         </button>
//       </div>

//       {tab === "playlists" ? (
//         playlists.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {playlists.map((playlist) => (
//               <PlaylistCard
//                 key={playlist.id}
//                 playlist={playlist}
//                 handleDelete={handleDeletePlaylist}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-zinc-400 text-center">No playlists available.</p>
//         )
//       ) : savedTracks.length > 0 ? (
//         <TrackerList
//           tracks={savedTracks}
//           onPlay={(uri) => {
//             window.open(`https://open.spotify.com/track/${uri.split(":")[2]}`, "_blank");
//           }}
//           onDelete={handleDeleteTrack}
//         />
//       ) : (
//         <p className="text-zinc-400 text-center">No saved tracks found.</p>
//       )}
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PlaylistCard from '../components/PlaylistCard';
import TrackerList from '../components/TrackerList';

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'playlists';
  const code = searchParams.get('code');

  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState();

useEffect(() => {
  async function authenticateAndFetch() {
    setLoading(true);
    try {
      let displayName;

      // Step 1: Handle the Spotify authorization code
      if (code) {
        const res = await fetch("/api/authtoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
     console.log(data,"uidata")
        if (res.ok) {
          displayName = data.display_name;
          setName(displayName); // still update state in case you use it later
          // Clean up the URL
          router.replace("/callback?tab=" + tab);
        } else {
          setError(data.error || "Failed to authenticate with Spotify.");
          setLoading(false);
          return;
        }
      }

      // Step 2: Get access token
      const accessTokenRes = await fetch("/api/authtoken");
      const { accessToken } = await accessTokenRes.json();

      if (!accessToken) {
        throw new Error("Missing access token");
      }

      // Use displayName from response or fallback to previously stored value
      const finalName = displayName || name || localStorage.getItem("display_name");

      // Optional: Store it in localStorage if needed across sessions
      if (finalName) {
        localStorage.setItem("display_name", finalName);
      }

      // Step 3: Fetch playlists and saved tracks
      const [playlistRes, savedTrackRes] = await Promise.all([
        fetch("/api/lib/playlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-display-name": finalName,
          },
        }),
        fetch("/api/lib/saved-tracks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-display-name": finalName,
          },
        }),
      ]);

      const playlistsData = await playlistRes.json();
      const savedTracksData = await savedTrackRes.json();

      setPlaylists(playlistsData);
      setSavedTracks(savedTracksData);
    } catch (err) {
      console.error("Error:", err);
      setError("Authentication failed or Spotify API error");
    } finally {
      setLoading(false);
    }
  }

  authenticateAndFetch();
}, [code, tab]);


  const handleDeletePlaylist = async (id) => {
    try {
      await fetch(`/api/spotify/playlists/${id}`, { method: 'DELETE' });
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting playlist:', err);
    }
  };

  const handleDeleteTrack = async (id) => {
    try {
      await fetch(`/api/spotify/saved-tracks/${id}`, { method: 'DELETE' });
      setSavedTracks((prev) => prev.filter((track) => track.id !== id));
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === 'playlists' ? 'bg-green-600' : 'bg-zinc-700'
          }`}
          onClick={() => router.push('/callback?tab=playlists')}
        >
          Playlists
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === 'saved' ? 'bg-green-600' : 'bg-zinc-700'
          }`}
          onClick={() => router.push('/callback?tab=saved')}
        >
          Saved Tracks
        </button>
      </div>

      {tab === 'playlists' ? (
        playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                handleDelete={handleDeletePlaylist}
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center">No playlists available.</p>
        )
      ) : savedTracks.length > 0 ? (
        <TrackerList tracks={savedTracks} onPlay={(uri) => {
          window.open(`https://open.spotify.com/track/${uri.split(':')[2]}`, '_blank');
        }} onDelete={handleDeleteTrack} />
      ) : (
        <p className="text-zinc-400 text-center">No saved tracks found.</p>
      )}
    </div>
  );
}

// callback.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import { getTokens, getValidAccessToken, getUserPlaylists, getUserSavedTracks } from '../lib/spotify';
// import PlaylistCard from '../components/PlaylistCard';
// import TrackerList from '../components/TrackerList';

// export default function Callback() {
//   const searchParams = useSearchParams();
//   const tab = searchParams.get('tab') || 'playlists'; // default to playlists
//   const code = searchParams.get('code');

//   const [loading, setLoading] = useState(true);
//   const [playlists, setPlaylists] = useState([]);
//   const [savedTracks, setSavedTracks] = useState([]);
//   const [error, setError] = useState('');
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     async function fetchData() {
//       const code = searchParams.get('code');
//       const tokenInStorage = localStorage.getItem('spotify_access_token');

//       if (tokenInStorage) {
//         // Token is in storage, proceed with loading data
//         await loadData(tokenInStorage);
//         return;
//       }

//       if (code) {
//         try {
//           const { access_token } = await getTokens(code);
//           localStorage.setItem('spotify_access_token', access_token);
//           window.history.replaceState({}, document.title, window.location.pathname);
//           await loadData(access_token);
//         } catch (err) {
//           console.error('Error loading token:', err);
//           setError('Failed to load token');
//           setLoading(false);
//         }
//       } else {
//         setError('No token or code available');
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [userId]);

//   async function loadData(accessToken) {
//     const token = await getValidAccessToken();
//     if (!token) {
//       setError('Token expired and refresh failed. Please log in again.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const userRes = await axios.get('https://api.spotify.com/v1/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserId(userRes.data.id);

//       const [userPlaylists, userTracks] = await Promise.all([
//         getUserPlaylists(token),
//         getUserSavedTracks(token),
//       ]);

//       setPlaylists(userPlaylists);
//       setSavedTracks(userTracks);
//     } catch (err) {
//       console.error('Error loading data:', err);
//       setError('Failed to load playlists or tracks');
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) return <p className="text-white p-4">Loading...</p>;
//   if (error) return <p className="text-red-500 p-4">{error}</p>;

//   return (
//     <>
//       <div className="p-6 bg-zinc-900 min-h-screen text-white">
//         {tab === 'playlists' && (
//           <>
//             <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
//             {playlists.length > 0 ? (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {playlists.map((playlist) => (
//                   <PlaylistCard key={playlist.id} playlist={playlist} />
//                 ))}
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//                 <p>No playlists available. Please add playlists to your Spotify account.</p>
//               </div>
//             )}
//           </>
//         )}

//         {tab === 'saved' && (
//           <>
//             {savedTracks.length > 0 ? (
//               <TrackerList
//                 tracks={savedTracks}
//                 onPlay={(uri) =>
//                   window.open(`https://open.spotify.com/track/${uri.split(':')[2]}`, '_blank')
//                 }
//               />
//             ) : (
//               <div className="flex items-center justify-center h-48 text-center text-zinc-400">
//                 <p>No saved tracks found. Please add tracks to your Spotify library.</p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
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

