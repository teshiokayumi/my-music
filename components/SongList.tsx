
import React from 'react';
import { Song } from '../types';

interface SongListProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (id: string) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const PlayingIcon = () => (
  <div className="flex items-center justify-center h-6 w-6 space-x-0.5">
    <span className="w-1 h-3 bg-white animate-pulse [animation-delay:-0.3s]"></span>
    <span className="w-1 h-5 bg-white animate-pulse [animation-delay:-0.15s]"></span>
    <span className="w-1 h-3 bg-white animate-pulse"></span>
  </div>
);


const SongList: React.FC<SongListProps> = ({ songs, onSelectSong, onEditSong, onDeleteSong, currentSong, isPlaying }) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-gray-600 mb-4 border border-white/5">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <p className="text-gray-500 font-medium">No tracks match your vibe. Try searching something else.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {songs.map(song => {
        const isActive = currentSong?.id === song.id;
        return (
          <div
            key={song.id}
            onClick={() => onSelectSong(song)}
            className={`group bg-gray-900/40 rounded-[2rem] overflow-hidden border border-white/5 hover:border-indigo-500/30 hover:bg-gray-900/60 transition-all duration-500 cursor-pointer flex flex-col shadow-lg shadow-black/20 ${isActive ? 'ring-2 ring-indigo-500/50 scale-[1.02]' : ''}`}
          >
            <div className="relative aspect-square overflow-hidden m-4 rounded-[1.5rem]">
              <img src={song.coverArt} alt={song.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className="bg-white/10 backdrop-blur-md rounded-full p-4 text-white transform transition-transform duration-300 hover:scale-110">
                  {isActive && isPlaying ? <PlayingIcon /> : <PlayIcon />}
                </div>
              </div>

              {/* Quick Actions overlay */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-300 delay-75">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSong(song);
                  }}
                  className="p-2.5 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-indigo-600 hover:scale-110 transition-all shadow-xl"
                  title="Edit track"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSong(song.id);
                  }}
                  className="p-2.5 bg-black/60 backdrop-blur-xl rounded-xl text-white hover:bg-red-600 hover:scale-110 transition-all shadow-xl"
                  title="Delete track"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-1">
              <h3 className={`font-black tracking-tight truncate text-lg ${isActive ? 'text-indigo-400' : 'text-white'}`}>{song.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-bold truncate max-w-[70%]">{song.artist}</p>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 bg-gray-950 px-2 py-1 rounded-md border border-white/5">{song.genre}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
