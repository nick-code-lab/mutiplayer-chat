import React, { useState, useEffect, useRef } from 'react';

function AudioCard({ src }) {
    const audioRef = useRef();
    const [isPlaying, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlayPause = () => {
        setPlaying(!isPlaying);
        if (audioRef.current.paused) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    };

    const handleProgress = () => {
        const audio = audioRef.current;
        const progress = (audio.currentTime / audio.duration) * 100;
        setProgress(progress);
    };

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('timeupdate', handleProgress);
        return () => {
          setPlaying(!isPlaying);
            audio.removeEventListener('timeupdate', handleProgress);
        };
    }, []);

    return (
        <div>
            <audio ref={audioRef} src={src} />
            <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <div>
                <div style={{ width: `${progress}%`, backgroundColor: 'blue', height: '10px' }}></div>
            </div>
        </div>
    );
}

export default AudioCard;
