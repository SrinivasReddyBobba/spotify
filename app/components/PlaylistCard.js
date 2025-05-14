'use client';

export default function PlaylistCard({ playlist, handleDelete }) {
  return (
    <div className="bg-zinc-800 rounded shadow p-4 flex flex-col justify-between h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      <img
        src={playlist.images?.[0]?.url}
        alt={playlist.name}
        className="rounded mb-4 w-full aspect-square object-cover"
      />
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">{playlist.name}</h2>
        <p className="text-sm text-zinc-400">{playlist.owner?.display_name}</p>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <a
          href={playlist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-400 flex-1 text-center"
        >
          Play
        </a>
        <button
          onClick={() => handleDelete(playlist.id)}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-400 sm:w-auto w-full"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

