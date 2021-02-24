import { Command as CMD } from "../..";
import Discord from "discord.js";

let eye: number;

type o = {
  name: string;
  category: string | undefined;
}[];

type ok = {
  general: string[];
  inkthought: string[];
  honkers: string[];
}[];

const Command: CMD = {
  async run(client, message, args) {
    // array to sort out what commands there are
    let obj: o = [];

    // sorts out obj according to category
    let sorted: ok = [
      {
        general: [],
        inkthought: [],
        honkers: [],
      },
    ];

    for (eye = 0; eye < client.commands.array().length; eye++) {
      obj.push({
        name: client.commands.array()[eye].info.name,
        category: client.commands.array()[eye].info.category,
      });

      if (obj[eye].category == "general") {
        sorted[0].general.push(`\`${client.commands.array()[eye].info.name}\``);
      }

      if (obj[eye].category == "inkthought") {
        sorted[0].inkthought.push(
          `\`${client.commands.array()[eye].info.name}\``
        );
      }

      if (obj[eye].category == "honkers") {
        sorted[0].honkers.push(`\`${client.commands.array()[eye].info.name}\``);
      }
    }

    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
      .setTitle(":sparkles: Help")
      .setColor("RANDOM")
      .addFields(
        {
          name: "General",
          value: sorted[0].general.join(", "),
          inline: true,
        },
        {
          name: "inkthought",
          value: sorted[0].inkthought.join(", "),
          inline: true,
        },
        {
          name: "honkers",
          value: sorted[0].honkers.join(", "),
          inline: true,
        }
      );

    return message.channel.send(embed);
  },
  info: {
    name: "help",
    title: "Help",
    res: "",
    aliases: ["h"],
  },
};

export default Command;
