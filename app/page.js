'use client';

import { useState, useEffect } from 'react';
import { getLoginUrl } from './lib/spotify';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const tokenRes = await fetch('/api/authtoken');
      const tokenData = await tokenRes.json();

      if (tokenData.accessToken) {
        setIsLoggedIn(true);
      }
    }

    checkLoginStatus();
  }, []);

  // if (!isLoggedIn) {
    return (
      <div className="text-white text-center p-6">
        <h2 className="text-xl mb-4">Welcome to Spotify Clone</h2>
        <a
          href={getLoginUrl()}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
        >
          Log in with Spotify
        </a>
      </div>
    );
  // }

  // return null; // No content shown after login
}








// 'use client';

// import { useEffect, useState } from 'react';
// import { getLoginUrl } from './lib/spotify';
// import { getUserSavedTracks } from './lib/spotify';
// import { refreshAccessToken } from './lib/auth';
// import TrackCard from './components/TrackCard';

// export default function Home() {
//   const [tracks, setTracks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     async function loadTracks() {
//       let accessToken = localStorage.getItem('spotify_access_token');
//       const expiresAt = localStorage.getItem('spotify_expires_at');

//       if (!accessToken || !expiresAt) {
//         setIsLoggedIn(false);
//         setLoading(false);
//         return;
//       }

//       // Check if token is expired
//       if (Date.now() > parseInt(expiresAt)) {
//         try {
//           const newTokenData = await refreshAccessToken();
//           accessToken = newTokenData.access_token;

//           localStorage.setItem('spotify_access_token', accessToken);
//           localStorage.setItem('spotify_expires_at', Date.now() + newTokenData.expires_in * 1000);
//         } catch (err) {
//           console.error('Token refresh failed:', err);
//           setIsLoggedIn(false);
//           setLoading(false);
//           return;
//         }
//       }

//       setIsLoggedIn(true);

//       try {
//         const savedTracks = await getUserSavedTracks(accessToken);
//         setTracks(savedTracks);
//       } catch (err) {
//         console.error('Error loading tracks:', err);
//         setError('Failed to load favorite tracks');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadTracks();
//   }, []);
//   // const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // useEffect(() => {
//   //   const token = localStorage.getItem('spotify_access_token');
//   //   if (!token) {
//   //     setIsLoggedIn(false);
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   setIsLoggedIn(true);

//   //   async function fetchTracks() {
//   //     try {
//   //       const savedTracks = await getUserSavedTracks(token);
//   //       setTracks(savedTracks);
//   //     } catch (err) {
//   //       console.error('Error loading tracks:', err);
//   //       setError('Failed to load favorite tracks');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   fetchTracks();
//   // }, []);

//   if (loading) {
//     return <p className="text-white p-4">Loading...</p>;
//   }

//   if (!isLoggedIn) {
//     return (
//       <>
//       <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
//         <h1 className="text-4xl font-bold mb-6">Spotify Homepage Clone</h1>
//         <a
//           href={getLoginUrl()}
//           className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
//         >
//           Log in with Spotify
//         </a>
//       </div>
//       </>
//     );
//   }

//   if (error) {
//     return <p className="text-red-500 p-4">{error}</p>;
//   }

//   return (
//     <div className="p-6 bg-zinc-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-6">ఇష్టమైన పాటలు</h1>
//       <ul className="space-y-4">
//         {tracks.map((track) => (
//           <TrackCard key={track.id} track={track} />
//         ))}
//       </ul>
//     </div>
//   );
// }
