import * as sv from "@minecraft/server";
import { Server, CommandInfo } from "@lib/minecraft";
import { MBE, MBETypes } from "./mbe";

const cmdInfo: { full: CommandInfo; mini: CommandInfo } = {
  full: {
    name: "full",
    aliases: ["f"],
    description: "Spawn full MBE",
    usage: [
      {
        name: "tileName",
        type: "string",
        default: false,
      },
      {
        name: "position",
        type: "xyz",
        default: false,
      },
    ],
  },
  mini: {
    name: "mini",
    aliases: ["m"],
    description: "Spawn mini MBE",
    usage: [
      {
        name: "tileName",
        type: "string",
        default: false,
      },
      {
        name: "position",
        type: "xyz",
        default: false,
      },
    ],
  },
};

Server.command.register(cmdInfo.full, (session, msg, args) => {
  new MBE(session, args.get("tileName"), args.get("position")).spawnFull();
  return void 0;
});

Server.command.register(cmdInfo.mini, (session, msg, args) => {
  new MBE(session, args.get("tileName"), args.get("position")).spawnMini();
  return void 0;
});

sv.system.afterEvents.scriptEventReceive.subscribe(
  ({ id, message, sourceEntity, sourceBlock }) => {
    switch (id) {
      case MBETypes.FullId:
        Server.command.callCommand(
          sourceEntity || sourceBlock,
          "full",
          message
        );
        break;
      case MBETypes.MiniId:
        Server.command.callCommand(
          sourceEntity || sourceBlock,
          "mini",
          message
        );
        break;
    }
  }
);
