import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const mediaRecorder = useRef(null);

    const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder.current = new MediaRecorder(stream);
          const audioChunks = [];
  
          mediaRecorder.current.ondataavailable = event => {
              audioChunks.push(event.data);
          };
  
          mediaRecorder.current.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
              const url = URL.createObjectURL(audioBlob);
              setAudioUrl(url);
          };
  
          mediaRecorder.current.start();
          setRecording(true);
      } catch (error) {
          console.error('Error starting recording', error);
      }
  };
  

  const stopRecording = () => {
    if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setRecording(false);
    }
};


    return (
        <div>
            <button onClick={() => {startRecording()}} disabled={recording}>
                Record
            </button>
            <button onClick={() => {stopRecording()}} disabled={!recording}>
                Stop
            </button>
            {audioUrl && (
                <audio controls>
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
};

export default AudioRecorder;