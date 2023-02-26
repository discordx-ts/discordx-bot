import type { CommandInteraction } from "discord.js";
import { ChannelType, Events, GuildMember } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On, Slash } from "discordx";

import env from "../env.js";

const forumParents = ["1068206905417289878", "1068206938669715467"];
const forumOpenTagIds = ["1079406020192895078", "1079440238461595781"];
const forumResolveTagIds = ["1079405822041403452", "1079440194278793377"];

@Discord()
export class Event {
  @On({ event: Events.ThreadCreate })
  async onCreate([thread]: ArgsOf<Events.ThreadCreate>): Promise<void> {
    const author = await thread.fetchOwner();
    const resolveCommand = thread.client.application.commands.cache.find(
      (cmd) => cmd.name === "resolved"
    );

    if (
      !resolveCommand ||
      !author ||
      !thread.isTextBased() ||
      !thread.parentId ||
      !forumParents.includes(thread.parentId)
    ) {
      return;
    }

    const newTags = new Set<string>();
    forumOpenTagIds.map((tagId) => newTags.add(tagId));
    thread.appliedTags.map((tagId) => newTags.add(tagId));
    forumResolveTagIds.map((tagId) => newTags.delete(tagId));
    await thread.setAppliedTags([...newTags]);

    await thread.send(
      `Hello <@${author.id}>, once your issue has been resolved, Please close the post with </resolved:${resolveCommand.id}>. Thank you!`
    );
  }

  @Slash({ description: "Lock and close a forum post", name: "resolved" })
  async resolved(interaction: CommandInteraction): Promise<void> {
    if (
      !(interaction.member instanceof GuildMember) ||
      interaction.channel?.type !== ChannelType.PublicThread ||
      !interaction.channel.parentId ||
      !forumParents.includes(interaction.channel.parentId)
    ) {
      await interaction.reply({
        content: "The command could not be executed in this channel",
        ephemeral: true,
      });
      return;
    }

    if (
      interaction.channel.ownerId !== interaction.member.id &&
      !interaction.member.roles.cache.has(env.HELPER_ROLE_ID)
    ) {
      await interaction.reply({
        content: "This command can only be executed by post authors or helpers",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "Closing post...",
      ephemeral: true,
    });

    const thread = interaction.channel;

    await thread.send(
      `A resolution has been made and the post has been locked by ${interaction.member}. It can only be reopened by moderators.`
    );

    const newTags = new Set<string>();
    forumResolveTagIds.map((tagId) => newTags.add(tagId));
    thread.appliedTags.map((tagId) => newTags.add(tagId));
    forumOpenTagIds.map((tagId) => newTags.delete(tagId));
    await thread.setAppliedTags([...newTags]);
    await thread.setLocked(true, "resolved");
    await thread.setArchived(true, "resolved");
  }
}
