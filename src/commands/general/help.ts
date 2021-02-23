import { Command as CMD } from "../..";
let eye: number;

const Command: CMD = {
  async run(client, message, args) {
    for (eye = 0; eye < client.commands.array().length; eye++) {
      console.log(client.commands.array()[eye].info.name);
    }
  },
  info: {
    name: "help",
    title: "Help",
    res: "",
    aliases: ["h"],
  },
};

export default Command;
