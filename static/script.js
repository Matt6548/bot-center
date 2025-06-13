let mediaRecorder;
let chunks = [];

const recordBtn = document.getElementById('record');

recordBtn.addEventListener('click', async () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = sendAudio;
        mediaRecorder.start();
        recordBtn.textContent = 'Stop recording';
    } else {
        mediaRecorder.stop();
        recordBtn.textContent = 'Start recording';
    }
});

function sendAudio() {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    chunks = [];
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    fetch('/api/gpt-bot', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(err => console.error(err));
}
