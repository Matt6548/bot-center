let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        startBtn.innerText = "Recording...";

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            audioChunks = [];

            const formData = new FormData();
            formData.append("file", audioBlob, "voice.webm");

            const response = await fetch("/speech_to_text", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            alert("GPT ответ: " + data.response);
        };

        mediaRecorder.start();

        setTimeout(() => {
            mediaRecorder.stop();
            startBtn.innerText = "Start recording";
        }, 5000); // Запись 5 секунд
    }
});
