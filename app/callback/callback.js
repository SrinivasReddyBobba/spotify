

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PlaylistCard from '../components/PlaylistCard';
import TrackerList from '../components/TrackerList';
import { Spin } from 'antd';

export default function Callback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tab = searchParams.get('tab') || 'playlists';
    const code = searchParams.get('code');

    const [loading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState([]);
    const [savedTracks, setSavedTracks] = useState([]);
    const [error, setError] = useState('');
    const [name, setName] = useState("Srinivasareddy");


    useEffect(() => {
        async function authenticateAndFetch() {
            setLoading(true);
            try {
                if (code) {
                    const res = await fetch("/api/authtoken", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code }),
                    });

                    const data = await res.json();
                    if (!res.ok) {
                        setError(data.error || "Failed to authenticate with Spotify.");
                        setLoading(false);
                        return;
                    }
                    router.replace("/callback?tab=" + tab);
                }
                const accessTokenRes = await fetch("/api/authtoken");
                const { accessToken, displayName } = await accessTokenRes.json();

                if (!accessToken) {
                    throw new Error("Missing access token");
                }
                const finalName = displayName || "Srinivasareddy";
                setName(finalName);
                localStorage.setItem("display_name", finalName);
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
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-zinc-900 min-h-screen text-white">
            {tab === 'playlists' ? (
                playlists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
