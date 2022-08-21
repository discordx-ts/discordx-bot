import type { CommandInteraction, GuildMember, User } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

import { packages } from "../util/packages.js";

@Discord()
export class Command {
  @Slash()
  package(
    @SlashChoice(...packages.map((pkg) => ({ name: pkg.name })))
    @SlashOption({ name: "package", type: ApplicationCommandOptionType.String })
    selection: string,
    @SlashOption({
      name: "mention",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember | User | undefined,
    interaction: CommandInteraction
  ): void {
    const pkg = packages.find((p) => p.name === selection);

    if (!pkg) {
      interaction.reply("❌ unable to found package");
      return;
    }

    let response =
      `**Package**: \`\`${pkg.name}\`\`\n` +
      `**Links**: [GitHub](${pkg.github}) || [NPM](${pkg.npm})\n`;

    if (user && user.id != interaction.user.id) {
      response += `\n${user}, ${interaction.member} requested you to view the mentioned package`;
    }

    interaction.reply({
      allowedMentions: {
        parse: [],
        users: user ? [user.id] : [],
      },
      content: response,
    });
  }
}
