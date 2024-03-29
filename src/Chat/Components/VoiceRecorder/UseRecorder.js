import { useEffect, useState } from "react";
import { addNewMessage } from '../../Tools';

const useRecorder = (username, refresh, setRefresh, ownerUsername) => {
    const [audioURL, setAudioURL] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => {
        if (recorder === null) {
            if (isRecording) {
                requestRecorder().then(setRecorder, console.error);
            }
            return;
        }

        if (isRecording) {
            recorder.start();
        } else {
            recorder.stop();
        }

        const handleData = e => {
            let temp = URL.createObjectURL(e.data);
            const d = new Date();
            let time = d.getHours() + ":" + d.getMinutes();
            addNewMessage(username, 'voice', true, time, temp, ownerUsername);
            setAudioURL(temp);
            setRefresh(refresh+1);
        };

        recorder.addEventListener("dataavailable", handleData);
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording]);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    return [audioURL, isRecording, startRecording, stopRecording];
};

async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream);
}

export default useRecorder;