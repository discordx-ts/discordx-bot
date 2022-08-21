import type { CommandInteraction } from "discord.js";
import { GuildMember } from "discord.js";
import { Discord, Slash } from "discordx";

if (!process.env.HELPER_ROLE_ID) {
  throw Error("Helper role id is not found in environment");
}

@Discord()
export class Command {
  @Slash({
    description:
      "Get helper role to receive quick notification for discord.ts changes or help required alert",
    name: "helper",
  })
  async helper(interaction: CommandInteraction): Promise<void> {
    if (
      !process.env.HELPER_ROLE_ID ||
      !(interaction.member instanceof GuildMember)
    ) {
      return;
    }

    const member = interaction.member;
    const isHasRole = member.roles.cache.find(
      (role) => role.id === process.env.HELPER_ROLE_ID
    );

    if (isHasRole) {
      await member.roles.remove(process.env.HELPER_ROLE_ID);
      await interaction.reply({
        content: "Your helper role has been removed.",
        ephemeral: true,
      });
    } else {
      await member.roles.add(process.env.HELPER_ROLE_ID);
      await interaction.reply({
        content:
          "Congratulation, I have assigned you helper role. You will receive quick notification for discord.ts changes or help required alert from other members. Thank you for joining helpers team.",
        ephemeral: true,
      });
      await interaction.channel?.send({
        content: `${interaction.member} has joined <@&${process.env.HELPER_ROLE_ID}>'s group :tada:`,
      });
    }
  }
}
