import { Command as CMD } from "../..";

const Command: CMD = {
  info: {
    name: "setup",
    title: "Setting up honkers",
    res:
      "In case you're wondering what honkers does, all it does is honk in a channel named <#693054535043776572>. You can name it something else, like #honk-goose as well. The <#693054535043776572> channel should already been created on invite, but in case it hasn't just make one.",
    aliases: ["honksetup"],
  },
};

export default Command;
