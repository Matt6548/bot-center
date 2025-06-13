from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/gpt-bot")
async def gpt_bot(file: UploadFile = File(...)):
    data = await file.read()
    # Here you would send `data` to OpenAI's API and return the response
    return {"message": f"Received {len(data)} bytes"}
