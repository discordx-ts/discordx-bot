import type { CommandInteraction, GuildMember, User } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { SearchDoc } from "../util/search-doc.js";

@Discord()
export class Command {
  @Slash({ description: "Search discordx document" })
  doc(
    @SlashOption({
      autocomplete: async (interaction) => {
        const choice = interaction.options.getFocused();
        const docs = await SearchDoc(String(choice));
        await interaction.respond(docs.slice(0, 24));
      },
      description: "Enter search text",
      name: "query",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    url: string,
    @SlashOption({
      description: "Mention member",
      name: "mention",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    user: GuildMember | User | undefined,
    interaction: CommandInteraction
  ): void {
    if (user && user.id != interaction.user.id) {
      url += `\n\n${user}, ${interaction.member} requested you to view the mentioned documentation`;
    }

    interaction.reply({
      allowedMentions: {
        parse: [],
        users: user ? [user.id] : [],
      },
      content: url,
    });
  }
}
