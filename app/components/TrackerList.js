
// 'use client';
// import React from 'react';

// export default function TrackerList({ tracks, onPlay }) {
//   return (
//     <div className="p-4 bg-zinc-900 text-white">
//       <h2 className="text-2xl font-semibold mb-4">Your Saved Tracks</h2>
//       <ul className="space-y-3">
//         {tracks.map((track) => (
//           <li key={track.id} className="flex items-center justify-between border-b border-zinc-700 py-2">
//             <div>
//               <p>{track.name}</p>
//               <p className="text-sm text-zinc-400">{track.artists[0].name}</p>
//             </div>
//             <button
//               onClick={() => onPlay(track.uri)}
//               className="bg-green-500 px-4 py-1 rounded hover:bg-green-400"
//             >
//               Play
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


'use client';
import React from 'react';

export default function TrackerList({ tracks, onPlay, onDelete }) {
  return (
    <div className="p-4 bg-zinc-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Your Saved Tracks</h2>
      <ul className="space-y-3">
        {tracks.map((track) => (
          <li
            key={track.id}
            className="flex items-center justify-between border-b border-zinc-700 py-2"
          >
            <div>
              <p>{track.name}</p>
              <p className="text-sm text-zinc-400">{track.artists[0].name}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => onPlay(track.uri)}
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-400"
              >
                Play
              </button>
              <button
                onClick={() => onDelete(track.id)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
