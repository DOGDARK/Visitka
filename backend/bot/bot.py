import os

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from dotenv import load_dotenv

load_dotenv()

bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()

WEBAPP_URL = os.getenv("WEBAPP_URL")


@dp.message(CommandStart())
async def start(message: types.Message) -> None:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(text="Открыть мини-приложение", web_app=WebAppInfo(url=WEBAPP_URL))]]
    )
    await message.answer("Привет", reply_markup=keyboard)


async def main() -> None:
    await dp.start_polling(bot)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
