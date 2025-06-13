from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/gpt-bot")
async def gpt_bot(file: UploadFile = File(...)):
    data = await file.read()
    # Here you would send `data` to OpenAI's API and return the response
    return {"message": f"Received {len(data)} bytes"}
from fastapi import UploadFile, File
import tempfile
import shutil

@router.post("/speech_to_text")
async def speech_to_text(file: UploadFile = File(...)):
    # Сохраняем временно
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    # Распознаём с помощью Whisper
    audio_file = open(temp_path, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)

    # Отправляем в GPT
    chat_response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": transcript["text"]}],
        temperature=0.7,
        max_tokens=500
    )

    reply = chat_response.choices[0].message["content"]
    return {"response": reply}
