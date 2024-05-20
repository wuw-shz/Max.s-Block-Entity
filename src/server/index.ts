import * as sv from "@minecraft/server";
import { Server } from "@lib/minecraft";
import { MBE, MBETypes } from "./mbe";

sv.world.beforeEvents.chatSend.subscribe((ev) => {
  const sender = ev.sender;
  const msg = ev.message;
  if (msg.startsWith("-")) {
    ev.cancel = true;
    const mbe = new MBE(sender);
    const cmd = msg.slice(1);
    switch (cmd) {
      case "f" || "full":
        mbe.spawnFull();
        break;
      case "m" || "mini":
        mbe.spawnMini();
        break;
    }
  }
});

sv.system.afterEvents.scriptEventReceive.subscribe(
  ({ id, message, sourceEntity, sourceBlock }) => {
    const args = message.split(" ", 1);
    const block = args[0];
    const pos = message.slice(message.indexOf(" ") + 1);
    // const tag =
    switch (id) {
      case MBETypes.FullId:
        (
          (sourceEntity && new MBE(sourceEntity, block, pos)) ||
          (sourceBlock && new MBE(sourceBlock, block, pos))
        )?.spawnFull();
        break;
      case MBETypes.MiniId:
        (
          (sourceEntity && new MBE(sourceEntity, block, pos)) ||
          (sourceBlock && new MBE(sourceBlock, block, pos))
        )?.spawnMini();
        break;
    }
  }
);

sv.system.runInterval(() => {
  sv.world.getAllPlayers().forEach((pl) => {
    pl.onScreenDisplay.setActionBar(Server.player.getDirection(pl));
  });
  sv.world
    .getDimension("overworld")
    .getEntities({
      type: "minecraft:armor_stand",
      name: "Grumm",
    })
    .forEach((mbe) => {
      mbe.playAnimation("animation.armor_stand.entertain_pose", {
        controller: "align.arms",
        stopExpression: "0",
      });
      mbe.playAnimation("animation.player.move.arms.zombie", {
        controller: "size.mini_block",
        stopExpression: "0",
      });
      mbe.teleport(mbe.location);
      mbe.addEffect("invisibility", 2, {
        amplifier: 255,
        showParticles: false,
      });
      switch (mbe.getTags().find((tag) => tag.startsWith("mbe:"))) {
        case MBETypes.FullId:
          mbe.playAnimation("animation.ghast.scale", {
            controller: "size.full_block",
            stopExpression: "0",
          });
          mbe.playAnimation("animation.fireworks_rocket.move", {
            controller: "align.full_block",
            stopExpression: "0",
          });
          break;
      }
    });
});
