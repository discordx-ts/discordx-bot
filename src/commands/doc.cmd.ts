import {
  ApplicationCommandOptionType,
  GuildMember,
  type CommandInteraction,
  type User,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { SearchDoc } from "../util/search-doc.js";

@Discord()
export class Command {
  @Slash({ description: "Search discordx document" })
  async doc(
    @SlashOption({
      autocomplete: async (interaction) => {
        const choice = interaction.options.getFocused();
        const docs = await SearchDoc(choice);
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
    interaction: CommandInteraction,
  ): Promise<void> {
    if (!(interaction.member instanceof GuildMember)) {
      return;
    }

    if (user && user.id != interaction.user.id) {
      url += `\n\n${user.toString()}, ${interaction.member.toString()} requested you to view the mentioned documentation`;
    }

    await interaction.reply({
      allowedMentions: {
        parse: [],
        users: user ? [user.id] : [],
      },
      content: url,
    });
  }
}
