import React, { useRef, useState } from 'react';

function CaptureVoice() {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const audioRef = useRef();
    let mediaRecorder = useRef(null);

    const startRecording = () => {
        setRecording(true);
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder.current = new MediaRecorder(stream);
                    mediaRecorder.current.start();

                    const audioChunks = [];
                    mediaRecorder.current.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.current.onstop = () => {
                        const audioBlob = new Blob(audioChunks);
                        const audioUrl = URL.createObjectURL(audioBlob);
                        setAudioURL(audioUrl);
                    };
                }).catch(err => console.log(err));
        }
    };

    const stopRecording = () => {
        setRecording(false);
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
        }
    };

    return (
        <div>
            <button onClick={startRecording} disabled={recording}>Start Recording</button>
            <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
            <audio src={audioURL} controls ref={audioRef} />
        </div>
    );
}

export default CaptureVoice;
