'use client';

export default function TrackCard({ track }) {
  return (
    <li className="flex justify-between items-center bg-zinc-800 p-4 rounded">
      <div>
        <p className="text-lg">{track.name}</p>
        <p className="text-sm text-zinc-400">{track.artists.map((a) => a.name).join(', ')}</p>
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
  );
}
