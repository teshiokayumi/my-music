
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Song } from '../types';

// SVG Icons defined as components
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);
const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1H8zm4 0a1 1 0 00-1 1v4a1 1 0 001 1h1a1 1 0 001-1V8a1 1 0 00-1-1h-1z" clipRule="evenodd" />
    </svg>
);
const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.168V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.832L4.555 5.168z" />
    </svg>
);
const PrevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15.445 5.168A1 1 0 0014 6v2.832L8.445 5.168A1 1 0 007 6v8a1 1 0 001.445.832L14 11.168V14a1 1 0 001.555.832l-6-4a1 1 0 000-1.664l6-4z" transform="translate(20, 0) scale(-1, 1) translate(20, 0)" />
    </svg>
);

interface AudioPlayerProps {
    song: Song;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    onNext: () => void;
    onPrev: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ song, isPlaying, setIsPlaying, onNext, onPrev }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.75);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null); // Reset error when song changes
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.error("Audio play failed:", err);
                        // Don't auto-stop here immediately as it might be a user interaction policy error
                        // But if it is NotSupportedError, we should probably stop.
                        if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
                            setIsPlaying(false);
                            setError(`Playback failed: ${err.message}`);
                        }
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, song.url, setIsPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setError(null);
        }
    };

    const handleError = () => {
        if (audioRef.current && audioRef.current.error) {
            const err = audioRef.current.error;
            let message = "An unknown error occurred";
            if (err.code === 1) message = "Aborted";
            if (err.code === 2) message = "Network error";
            if (err.code === 3) message = "Decoding failed";
            if (err.code === 4) message = "Source not supported";

            console.error("Audio error:", message, err);
            setIsPlaying(false);
            setError(message);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setProgress(Number(e.target.value));
        }
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (error) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-red-900/90 backdrop-blur-md text-white p-4 shadow-2xl z-50 flex justify-between items-center">
                <p className="font-bold">Error: {error}. The Loading might have failed or file format is unsupported.</p>
                <button onClick={() => setError(null)} className="bg-white/20 hover:bg-white/30 rounded-full p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-md text-white p-4 shadow-2xl z-50">
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onNext}
                onError={handleError}
                key={song.id}
                autoPlay={isPlaying}
            />
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4 w-1/4">
                    <img src={song.coverArt} alt={song.title} className="w-14 h-14 rounded-md object-cover" />
                    <div>
                        <p className="font-bold truncate">{song.title}</p>
                        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 w-1/2">
                    <div className="flex items-center gap-4">
                        <button onClick={onPrev} className="text-gray-400 hover:text-white transition-colors"><PrevIcon /></button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-indigo-400 transition-colors">
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <button onClick={onNext} className="text-gray-400 hover:text-white transition-colors"><NextIcon /></button>
                    </div>
                    <div className="w-full flex items-center gap-2 text-xs">
                        <span>{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-indigo-500"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-1/4 justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.073 3.016A1 1 0 004 4v12a1 1 0 001.555.832l8-6a1 1 0 000-1.664l-8-6a1 1 0 00-.482-.184zM6 6.528l4.472 3.354L6 13.236V6.528zM13 5a1 1 0 00-1 1v8a1 1 0 002 0V6a1 1 0 00-1-1z" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
