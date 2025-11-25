import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import uvicorn
from fastapi import FastAPI, HTTPException

from backend.api.core.db_init import close_orm, init_orm
from backend.api.core.exception_handler import http_exception_handler
from backend.api.users.routers import users_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    logger.info("Startup")
    try:
        await init_orm()
        logger.info("Db initialized")
        yield
    finally:
        logger.info("Shutdown")
        await close_orm()


app = FastAPI(lifespan=lifespan)
app.include_router(users_router)
app.add_exception_handler(HTTPException, http_exception_handler)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
