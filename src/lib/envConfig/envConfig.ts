if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in the environment variables');
}

export const envMongoUri = process.env.NEXT_PUBLIC_MONGODB_URI;
export const envTelegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
export const envTelegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
export const envEnviroment = process.env.NEXT_PUBLIC_ENVIROMENT;
export const envAppUrl = process.env.NEXT_PUBLIC_APP_URL;
export const envSPLAddress = process.env.NEXT_PUBLIC_SPL_ADDRESS;