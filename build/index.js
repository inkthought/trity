"use strict";
////////////////////////////////////////////
/////         Create Discord App       /////
////////////////////////////////////////////
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = __importDefault(require("fs"));
const config = require("../config.js");
const TOKEN = config.TOKEN;
class Client extends discord_js_1.default.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.default.Collection();
        this.aliases = new discord_js_1.default.Collection();
    }
    resolveCommand(name) {
        const byName = this.commands.get(name);
        if (byName)
            return byName;
        const byAlias = this.aliases.get(name);
        if (byAlias)
            return this.commands.get(byAlias);
        return undefined;
    }
}
const client = new Client();
// load commands
// Read command dir and get ctg
fs_1.default.readdir("./commands", (error, ctg) => {
    if (error)
        throw error;
    // loop through ctg
    ctg.forEach((category) => {
        // read each ctg and get command file
        fs_1.default.readdir(`./commands/${category}`, (err, commands) => {
            if (err)
                throw err;
            // Load commands in memory
            commands.forEach((command) => {
                const cmd = require(`./commands/${category}/${command}`)
                    .default;
                if (!cmd.help)
                    throw new Error(`Invalid command file structure ${command}!`);
                // update data
                cmd.help.category = category;
                cmd.location = `./commands/${category}/${command}`;
                console.log(`Loading command ${command}...`);
                // load command in memory
                client.commands.set(cmd.help.name, cmd);
                if (cmd.help.aliases && Array.isArray(cmd.help.aliases))
                    cmd.help.aliases.forEach((alias) => client.aliases.set(alias, cmd.help.name));
            });
        });
    });
});
// basic events
client.on("ready", () => {
    console.log(client.user.tag + "is ready.");
});
client.on("warn", console.warn);
client.on("error", console.error);
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (message.author.bot)
        return;
    if (message.content.indexOf(config.PREFIX) !== 0)
        return;
    const args = message.content.slice(config.PREFIX.length).trim().split(" ");
    const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!cmd)
        return;
    let command = client.resolveCommand(cmd);
    if (!command)
        return;
    try {
        yield command.run(client, message, args);
    }
    catch (e) {
        console.error(e);
        message.channel.send(`Something went wrong while executing command "**${command}**"!`);
    }
}));
client.login(TOKEN);
