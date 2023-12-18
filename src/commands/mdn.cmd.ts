import type { CommandInteraction, GuildMember, User } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { MDN_BASE_URL, searchMDN } from "../util/search-mdn.js";

@Discord()
export class Command {
  @Slash({ description: "Search mdn documentation" })
  async mdn(
    @SlashOption({
      autocomplete: async (interaction) => {
        const choice = interaction.options.getFocused();
        const docs = await searchMDN(String(choice));
        await interaction.respond(docs.slice(0, 24));
      },
      description: "Enter search query",
      name: "query",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    url: string,
    @SlashOption({
      description: "Mention member",
      name: "mention",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember | User | undefined,
    interaction: CommandInteraction,
  ): Promise<void> {
    url = MDN_BASE_URL + url;
    if (user && user.id != interaction.user.id) {
      url += `\n\n${user.toString()}, ${interaction.member?.toString()} requested you to view the mentioned mdn documentation`;
    }

    await interaction.reply(url);
  }
}
