import type { CommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";

import { packages } from "../util/packages.js";

@Discord()
export class Command {
  @Slash()
  links(interaction: CommandInteraction): void {
    const embed = new EmbedBuilder();
    embed.setTitle("discordx");
    embed.setURL("https://discordx.js.org");
    embed.setDescription(
      "Create a discord bot with TypeScript and Decorators!"
    );

    embed.addFields({
      name: "Documentation",
      value:
        "[discordx.js.org](https://discordx.js.org) [dev.to](https://dev.to/oceanroleplay/series/14317)",
    });

    embed.addFields({
      name: "GitHub",
      value:
        "[discordx](https://github.com/discordx-ts/discordx) " +
        "[templates](https://github.com/discordx-ts/templates)",
    });

    embed.addFields({
      name: "Packages",
      value: packages.map((pkg) => `[${pkg.nameShort}](${pkg.npm})`).join(" "),
    });

    embed.setFooter({
      text: "Giving us a star on Github will show your support ⭐",
    });

    interaction.reply({
      embeds: [embed],
    });
  }
}
