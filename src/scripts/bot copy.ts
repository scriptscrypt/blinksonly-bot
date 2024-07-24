// import { envTelegramBotToken } from "@/lib/envConfig/envConfig";
import { Bot } from "grammy";

import { envTelegramBotToken } from "../lib/envConfig/envConfig";

const bot = new Bot(envTelegramBotToken || "");

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
bot.command("amount", async (ctx) => {
  try {
    // Check if ctx.message exists
    if (!ctx.message) {
      return await ctx.reply(
        "There was an error processing your command. Please try again later."
      );
    }

    // Extract the amount from the command parameters
    const [, , ...args] = ctx.message.text.split(/\s+/); // Splitting by whitespace
    const solAmount = args.join(" ").trim(); // Rejoin arguments and trim whitespace

    // Refined validation logic to support various number formats
    if (
      solAmount !== "" &&
      !isNaN(parseFloat(solAmount)) &&
      parseFloat(solAmount) > 0
    ) {
      await ctx.reply(`You entered SOL amount: ${solAmount}`);
      // Here you can add any additional logic, e.g., sending the amount to a backend
    } else {
      // Provide more detailed feedback or suggestions
      await ctx.reply(
        'It seems like you didn\'t enter a number. Please try again with a valid number, like this: "/amount 0.01".'
      );
    }
  } catch (error) {
    console.error("Error processing /amount command:", error);
    await ctx.reply(
      "Sorry, there was an error processing your command. Please try again later."
    );
  }
});

bot.start();
