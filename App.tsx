
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Song } from './types';
import SongList from './components/SongList';
import AudioPlayer from './components/AudioPlayer';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "songs"), (snapshot) => {
      const loadedSongs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Song[];
      setSongs(loadedSongs);
    });
    return () => unsubscribe();
  }, []);

  const genres = useMemo(() => ['all', ...Array.from(new Set(songs.map(s => s.genre)))], [songs]);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch =
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genreFilter === 'all' || song.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [songs, searchTerm, genreFilter]);

  const handleSelectSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const handleNextSong = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    setCurrentSong(filteredSongs[nextIndex]);
    setIsPlaying(true);
  }, [currentSong, filteredSongs]);

  const handlePrevSong = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    setCurrentSong(filteredSongs[prevIndex]);
    setIsPlaying(true);
  }, [currentSong, filteredSongs]);

  const handleSaveSong = async (songData: Omit<Song, 'id'>) => {
    try {
      if (editingSong) {
        // Update existing
        await updateDoc(doc(db, "songs", editingSong.id), songData);
        if (currentSong?.id === editingSong.id) {
          setCurrentSong({ ...songData, id: editingSong.id });
        }
      } else {
        // Add new
        await addDoc(collection(db, "songs"), songData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving song: ", error);
      alert("Failed to save song. Check console for details.");
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      if (currentSong?.id === id) {
        setIsPlaying(false);
        setCurrentSong(null);
      }
      try {
        await deleteDoc(doc(db, "songs", id));
      } catch (error) {
        console.error("Error deleting song: ", error);
        alert("Failed to delete song.");
      }
    }
  };

  const openEditModal = (song: Song) => {
    setEditingSong(song);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSong(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans selection:bg-indigo-500/30">
      <header className="bg-gray-900/80 backdrop-blur-xl sticky top-0 z-40 shadow-2xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">SONICLOUD</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group bg-white text-black hover:bg-indigo-50 font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-xl flex items-center transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Upload Track
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-8 relative">
        <div className="bg-gray-900/50 rounded-3xl p-6 mb-12 sticky top-[88px] z-30 backdrop-blur-2xl border border-white/5 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-grow group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                type="text"
                placeholder="Search tracks, artists, moods..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-950 text-white placeholder-gray-600 border border-gray-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-inner"
              />
            </div>
            <div className="lg:w-72">
              <select
                value={genreFilter}
                onChange={e => setGenreFilter(e.target.value)}
                className="w-full bg-gray-950 text-white border border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none cursor-pointer hover:border-gray-700 shadow-inner"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre} className="bg-gray-900">{genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <SongList
          songs={filteredSongs}
          onSelectSong={handleSelectSong}
          onEditSong={openEditModal}
          onDeleteSong={handleDeleteSong}
          currentSong={currentSong}
          isPlaying={isPlaying}
        />
        <div className="pb-32"></div>
      </main>

      {currentSong && (
        <AudioPlayer
          song={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
        />
      )}

      {isModalOpen && (
        <SongForm
          initialSong={editingSong}
          onSubmit={handleSaveSong}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

interface SongFormProps {
  initialSong: Song | null;
  onSubmit: (song: Omit<Song, 'id'>) => void;
  onCancel: () => void;
}

const SongForm: React.FC<SongFormProps> = ({ initialSong, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialSong?.title || '');
  const [artist, setArtist] = useState(initialSong?.artist || '');
  const [genre, setGenre] = useState(initialSong?.genre || '');
  const [audioUrl, setAudioUrl] = useState(initialSong?.url || '');
  const [coverArt, setCoverArt] = useState(initialSong?.coverArt || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'audio') {
      // 修正後（5MBまで許可）
      if (file.size > 5242880) {
        alert("Audio file size must be less than 5MB");
        return;
      }
    } else if (type === 'image') {
      // 修正後（5MBまで許可）
      if (file.size > 5242880) {
        alert("Image size must be less than 5MB");
        return;
      }
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') {
        setCoverArt(reader.result as string);
      } else {
        setAudioUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist || !genre || !audioUrl || !coverArt) {
      alert("Please provide all track details and files.");
      return;
    }
    setIsProcessing(true);
    onSubmit({ title, artist, genre, url: audioUrl, coverArt });
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-3xl w-full max-w-4xl border border-white/10 relative">
        <button onClick={onCancel} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-4xl font-black text-white mb-10 tracking-tight">
          {initialSong ? 'Edit Track' : 'Upload New Track'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div
              className="relative group cursor-pointer aspect-square bg-gray-950 rounded-3xl overflow-hidden border-2 border-dashed border-gray-800 hover:border-indigo-500 transition-all flex flex-col items-center justify-center shadow-inner"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverArt ? (
                <img src={coverArt} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <p className="text-sm font-bold text-gray-500">Drop Cover Art</p>
                </div>
              )}
              <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-white text-black text-xs font-black px-4 py-2 rounded-full shadow-lg">CHANGE COVER</span>
              </div>
              <input ref={coverInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Audio Source</label>
              <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 shadow-inner group">
                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'audio')}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-white file:text-black hover:file:bg-indigo-50 cursor-pointer"
                />
                {audioUrl && <p className="mt-4 text-xs font-medium text-indigo-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                  File linked and ready
                </p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Track Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Dreams" className="w-full bg-gray-950 text-white border border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Artist Name</label>
                <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Sonic J" className="w-full bg-gray-950 text-white border border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Genre</label>
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Lo-fi / Chill" className="w-full bg-gray-950 text-white border border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner" />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-10">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center uppercase tracking-widest"
              >
                {isProcessing ? "Processing..." : (initialSong ? "Update Track" : "Publish Track")}
              </button>
              <button type="button" onClick={onCancel} className="w-full bg-transparent hover:bg-white/5 text-gray-500 hover:text-white font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-xs">
                Dismiss Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
