from fastapi import FastAPI

from routers.first_router.first_router_controller import first_router

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "o World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


app.include_router(first_router)
