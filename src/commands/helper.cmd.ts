import type { CommandInteraction } from "discord.js";
import { ChannelType, GuildMember } from "discord.js";
import { Discord, Slash } from "discordx";

import env from "../env.js";

@Discord()
export class Command {
  @Slash({
    description:
      "Get helper role to receive quick notification for discordx changes or help required alert",
    name: "helper",
  })
  async helper(interaction: CommandInteraction): Promise<void> {
    if (
      !env.HELPER_ROLE_ID ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.channel ||
      interaction.channel.type === ChannelType.GuildStageVoice
    ) {
      return;
    }

    const member = interaction.member;
    const isHasRole = member.roles.cache.find(
      (role) => role.id === env.HELPER_ROLE_ID,
    );

    if (isHasRole) {
      await member.roles.remove(env.HELPER_ROLE_ID);
      await interaction.reply({
        content: "Your helper role has been removed.",
        ephemeral: true,
      });
    } else {
      await member.roles.add(env.HELPER_ROLE_ID);
      await interaction.reply({
        content:
          "Congratulation, I have assigned you helper role. You will receive quick notification for discordx changes or help required alert from other members. Thank you for joining helpers team.",
        ephemeral: true,
      });

      await interaction.channel.send({
        content: `${interaction.member.toString()} has joined <@&${
          env.HELPER_ROLE_ID
        }>'s group :tada:`,
      });
    }
  }
}
