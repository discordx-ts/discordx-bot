import type { CommandInteraction, GuildMember, User } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { MDN_BASE_URL, searchMDN } from "../util/search-mdn.js";

@Discord()
export class Command {
  @Slash()
  mdn(
    @SlashOption({
      autocomplete: async (interaction) => {
        const choice = interaction.options.getFocused();
        const docs = await searchMDN(String(choice));
        await interaction.respond(docs.slice(0, 24));
      },
      name: "query",
      type: ApplicationCommandOptionType.String,
    })
    url: string,
    @SlashOption({
      name: "mention",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember | User | undefined,
    interaction: CommandInteraction
  ): void {
    url = MDN_BASE_URL + url;
    if (user && user.id != interaction.user.id) {
      url += `\n\n${user}, ${interaction.member} requested you to view the mentioned mdn documentation`;
    }
    interaction.reply(url);
  }
}
