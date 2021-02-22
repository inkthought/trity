////////////////////////////////////////////
/////         Create Discord App       /////
////////////////////////////////////////////

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import Discord from "discord.js";
import fs from "fs";

const config: {
  TOKEN: string;
  PREFIX: string;
} = require("../config.js");

class Client extends Discord.Client {
  commands: Discord.Collection<string, Command>;
  aliases: Discord.Collection<string, string>;
  res: Discord.Collection<string, string>;

  constructor(options?: Discord.ClientOptions) {
    super(options);

    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.res = new Discord.Collection();
  }

  resolveCommand(name: string) {
    const byName = this.commands.get(name);
    if (byName) return byName;
    const byAlias = this.aliases.get(name);
    if (byAlias) return this.commands.get(byAlias);
    return undefined;
  }
}

export type CommandRun = (
  client: Client,
  message: Discord.Message,
  args: string[]
) => any;

export interface CommandHelp {
  name: string;
  title: string;
  res: string;
  aliases: string[];
  category?: string;
}

export interface Command {
  info: CommandHelp;
  location?: string;
}

const client = new Client();

// load commands
// Read command dir and get ctg
fs.readdir("./commands", (error, ctg) => {
  if (error) throw error;

  // loop through ctg
  ctg.forEach((category: string) => {
    console.log("Loading " + category + "...");
    // read each ctg and get command file
    fs.readdir(`./commands/${category}`, (err, commands) => {
      if (err) throw err;

      // Load commands in memory
      commands.forEach((command) => {
        const cmd: Command = require(`./commands/${category}/${command}`)
          .default;
        if (!cmd.info) throw new Error(`no info for ${command}!`);

        // update data
        cmd.info.category = category;
        cmd.location = `./commands/${category}/${command}`;

        console.log(`- Loaded ${command}`);

        // load command in memory
        client.commands.set(cmd.info.name, cmd);
        if (cmd.info.aliases && Array.isArray(cmd.info.aliases))
          cmd.info.aliases.forEach((alias) =>
            client.aliases.set(alias, cmd.info.name)
          );
      });
    });
  });
});

// basic events
client.on("ready", () => {
  console.log("Trity is ready.");
  // @ts-ignore
  client.user.setActivity("inkthought", { type: "WATCHING" });
});
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.PREFIX) !== 0) return;

  const args = message.content.slice(config.PREFIX.length).trim().split(" ");
  const cmd = args.shift()?.toLowerCase();

  if (!cmd) return;
  let command = client.resolveCommand(cmd);

  if (!command) return;

  try {
    console.log(`${message.author.tag} used ${command.info.name}`);
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
      .setTitle(`:sparkles: ${command.info.title}`)
      .setColor("RANDOM")
      .setDescription(command.info.res)
      // @ts-ignore
      .setFooter(
        message.author.tag,
        // @ts-ignore
        message.author.avatarURL({
          // @ts-ignore
          type: "png",
          dynamic: true,
          size: 2048,
        })
      )
      .setTimestamp();
    return message.channel.send(embed);
  } catch (e) {
    console.error(e);
    message.channel.send(
      `hey hey <@457805013474082817>, fix this: \`\`\`${command} ERROR: \n${e}\`\`\``
    );
  }
});

const TOKEN: string | undefined = process.env.TOKEN;
client.login(TOKEN);
