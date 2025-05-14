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
  return (
   <div className="text-black text-center p-6">
  <h2 className="text-2xl font-bold mb-4">Welcome to Spotify Clone</h2>
  <a
    href={getLoginUrl()}
    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
  >
    Log in with Spotify
  </a>
</div>

  );
}






