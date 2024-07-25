// import { envTelegramBotToken } from "@/lib/envConfig/envConfig";
import { webhookCallback, Bot } from "grammy";

import { envMongoUri, envTelegramBotToken } from "../lib/envConfig/envConfig";

import { MongoClient } from "mongodb";
const bot = new Bot(envTelegramBotToken || "");

const clientPromise: Promise<MongoClient> = MongoClient.connect(
  envMongoUri || ""
);

// Define the keyboard layout
const keyboardLayout = [
  // [{ text: "Enter SOL Amount", callback_data: "sol_amt" }],
  [{ text: "Help", callback_data: "help" }],
];

// Setup BOT COMPLETE
// *********************************************************************

// Handler for the /start command
bot.command("start", async (ctx) => {
  try {
    // Get bot's username
    const botUsername = ctx.me?.username;

    // Reply with the welcome message and the custom keyboard
    await ctx.reply(`Hello! I'm @${botUsername}. Choose an option below:`, {
      reply_markup: {
        keyboard: keyboardLayout,
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } catch (error) {
    console.error("Error displaying commands list:", error);
    await ctx.reply("Sorry, there was an error. Try again later.");
  }
});

// Handler for the /help command
bot.command("help", async (ctx) => {
  try {
    const helpText = `
Available commands:
/sol-amt - Enter the SOL amount
/start - Start a new session
/help - Show this help message
`;
    await ctx.reply(helpText);
  } catch (error) {
    console.error("Error displaying help message:", error);
    await ctx.reply("Sorry, there was an error. Try again later.");
  }
});

// Handler for the /commands command
bot.command("commands", async (ctx) => {
  try {
    const commandsKeyboard = [
      [{ text: "Enter SOL Amount", callback_data: "sol_amt" }],
      [{ text: "Start", callback_data: "start" }],
      [{ text: "Show Help", callback_data: "help" }],
    ];

    await ctx.reply("Choose a command:", {
      reply_markup: {
        keyboard: commandsKeyboard,
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } catch (error) {
    console.error("Error displaying commands keyboard:", error);
    await ctx.reply("Sorry, there was an error. Try again later.");
  }
});

// Handler for the 'sol_amt' button
bot.callbackQuery("sol_amt", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Please enter the SOL amount:");
});

// Handler for the 'help' button
bot.callbackQuery("help", async (ctx) => {
  await ctx.answerCallbackQuery();
  // Display help message or commands list here
  await ctx.reply(
    "Here's how to use me:\n1. Enter SOL Amount - Type /sol-amt and enter the amount."
  );
});

// bot.on("message", async (ctx) => {
//   if (ctx.message.text && !ctx.message.text.startsWith("/")) {
//     const solAmount = parseFloat(ctx.message.text);
//     if (isNaN(solAmount)) {
//       await ctx.reply("Invalid input. Please enter a valid number.");
//     } else {
//       // Send the SOL amount to the backend (you can implement this part)

//       console.log(`current ctx`, ctx);
//       await ctx.reply(`Received SOL amount: ${solAmount}`);
//     }
//   }
// });

// Modified command to /amount
// Handler for the /amount command
bot.command("magic", async (ctx) => {
  try {
    // Check if ctx.message exists
    if (!ctx.message) {
      return await ctx.reply(
        "There was an error processing your command. Please try again later."
      );
    }

    // /magic <address>
    const [magic, ...rest] = ctx.message.text.split(/\s+/);
    const splAddress = rest.join(" ").trim();
    // const splAddress = rest.slice(0, -1).join(" ").trim();
    // const solAmount = rest[rest.length - 1];
    console.log(`splAddress :`, splAddress);

    console.log(`current chatId`, ctx.chat.id);
    console.log(`current userId :`, ctx.message.chat.id);

    // Add these to DB
    const client = await clientPromise;
    const db = client.db();

    // // `groups` is the collection name
    const groupsCollection = db.collection("groups");
    // if (!ctx.chat.id || !ctx.message.chat.id || !splAddress) {
    //   throw new Error("Telegram chat ID is not set in environment variables");
    // }

    // save to DB :
    console.log(`${ctx.message.chat.id} Id saving to DB`, ctx.message.chat.id);

    groupsCollection.insertOne({
      // amount,
      chatId: ctx.chat.id,
      chatUserId: ctx.message.chat.id,
      chatName: ctx.chat.title,
      chatType: ctx.chat.type,
      splAddress,
      timestamp: Date.now().toString(),
    });

    // await ctx.reply(`Received SOL amount: ${solAmount}`);

    // Get a Blink URL :
    const blinkURL = `https://blinktochat.fun/api/actions/start/${ctx.chat.id}/${splAddress}`;
    await ctx.reply(blinkURL);

    const dialectUrl = `https://dial.to/devnet?action=solana-action:${blinkURL}`;

    await ctx.reply(dialectUrl);
    // Get user's Id and current chat's Id
  } catch (error) {
    console.error("Error processing /amount command:", error);
    await ctx.reply(
      "Sorry, there was an error processing your command. Please try again later."
    );
  }
});

// For Vercel Node Webhook :
export const handleUpdate = webhookCallback(bot, "next-js");
export { bot };
// export default bot;

// For Dev to start the BOT :
// bot.start();
