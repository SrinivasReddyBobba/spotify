'use client';

export default function PlaylistCard({ playlist }) {
  return (
    <div className="bg-zinc-800 rounded shadow p-4 flex flex-col justify-between h-full">
      <img
        src={playlist.images?.[0]?.url}
        alt={playlist.name}
        className="rounded mb-4 w-full aspect-square object-cover"
      /> 
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">{playlist.name}</h2>
        <p className="text-sm text-zinc-400">{playlist.owner?.display_name}</p>
      </div>
      <a
        href={playlist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-green-500 text-white text-center px-3 py-2 rounded hover:bg-green-400"
      >
        Play
      </a>
    </div>
  );
}
