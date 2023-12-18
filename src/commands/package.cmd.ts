import type { CommandInteraction, GuildMember, User } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

import { packages } from "../util/packages.js";

@Discord()
export class Command {
  @Slash({ description: "Get discordx package information" })
  async package(
    @SlashChoice(...packages.map((pkg) => ({ name: pkg.name })))
    @SlashOption({
      description: "Select package",
      name: "package",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    selection: string,
    @SlashOption({
      description: "Mention member",
      name: "mention",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember | User | undefined,
    interaction: CommandInteraction,
  ): Promise<void> {
    const pkg = packages.find((p) => p.name === selection);

    if (!pkg) {
      await interaction.reply("❌ unable to found package");
      return;
    }

    let response =
      `**Package**: \`\`${pkg.name}\`\`\n` +
      `**Links**: [GitHub](${pkg.github}) || [NPM](${pkg.npm})\n`;

    if (user && user.id != interaction.user.id) {
      response += `\n${user.toString()}, ${interaction.member?.toString()} requested you to view the mentioned package`;
    }

    await interaction.reply({
      allowedMentions: {
        parse: [],
        users: user ? [user.id] : [],
      },
      content: response,
    });
  }
}
