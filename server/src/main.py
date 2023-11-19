from fastapi import FastAPI

from routers.wahlkreis.wahlkreis_router import wahlkreis_router

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "o World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


app.include_router(wahlkreis_router)
