import "@discordx/plugin-lava-player";

import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField, Partials } from "discord.js";
import { Client } from "discordx";

import env from "./env.js";

export const bot = new Client({
  // To only use global commands (use @Guild for specific guild command), comment this line
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMessageReactions,
  ],

  // Partials
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "discordx ",
  },
});

bot.once("ready", () => {
  // Synchronize applications commands with Discord
  void bot.initApplicationCommands();

  // set bot activity
  if (bot.user) {
    bot.user.setActivity("discordx.js.org");
  }

  console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  void bot.executeCommand(message);
});

async function run() {
  // Import commands/events
  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");

  // Let's start the bot
  await bot.login(env.BOT_TOKEN);
}

void run();
