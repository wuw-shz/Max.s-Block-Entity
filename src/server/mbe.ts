import * as sv from "@minecraft/server";
import { CommandPosition, Vector, Server } from "@lib/minecraft";
import {Vector3Utils} from '@lib/math'

export enum MBETypes {
  Full = "full",
  FullId = "mbe:full",
  Mini = "mini",
  MiniId = "mbe:mini",
}

export class MBE {
  sender: sv.Player | sv.Entity | sv.Block;
  position: sv.Vector3;
  block: sv.ItemStack | undefined;
  constructor(
    sender: sv.Player | sv.Entity | sv.Block,
    block?: string | sv.ItemStack | sv.Block,
    offset?: string | sv.Vector3
  ) {
    this.sender = sender;
    this.position = offset
      ? Vector.add(
          typeof offset == "string"
            ? CommandPosition.parseArgs(
                this.positionFormat(offset),
                0
              ).result.relativeTo(sender, true)
            : offset,
          Vector.ONE.div(2)
        )
      : Vector.add(Vector.from(sender.location).floor(), Vector.ONE.div(2));

    this.block = block
      ? block instanceof sv.ItemStack
        ? block
        : block instanceof sv.Block
        ? block.getItemStack(1, true)
        : sv.BlockPermutation.resolve(block).getItemStack() ||
          new sv.ItemStack(block)
      : sender instanceof sv.Block
      ? sender.getItemStack(1, true)
      : sender
          .getComponent("equippable")
          ?.getEquipmentSlot(sv.EquipmentSlot.Mainhand)
          .getItem();
  }

  private positionFormat(pos: string) {
    return pos.match(/\^|~-?(\d?)+|(?<=\s)-?\d+/g);
  }

  private spawnArmorStand(callback: (mbe: sv.Entity) => void) {
    this.block &&
      sv.system.run(() => {
        const mbe = this.sender.dimension.spawnEntity(
          "minecraft:armor_stand",
          this.sender.location
        );
        mbe.nameTag = "Grumm";
        mbe.runCommandAsync(
          `replaceitem entity @s slot.weapon.mainhand 0 ${this.block?.typeId}`
        );
        callback(mbe);
      });
  }

  spawnFull(callback?: (mbe: sv.Entity) => void) {
    this.spawnArmorStand((mbe) => {
      mbe.teleport(
        {
          x: this.position.x - 1.1245,
          y: this.position.y + 0.2325,
          z: this.position.z - 0.097,
        },
        { rotation: { x: 0, y: 81 } }
      );
      mbe.addTag("mbe:full");
      callback && callback(mbe);
    });
  }

  spawnMini(callback?: (mbe: sv.Entity) => void) {
    this.spawnArmorStand((mbe) => {
      mbe.teleport(
        {
          x: this.position.x - 0.417,
          y: this.position.y - 0.5,
          z: this.position.z - 0.035,
        },
        { rotation: { x: 0, y: 81 } }
      );
      mbe.addTag("mbe:mini");
      callback && callback(mbe);
    });
  }

  FullDirection(direction: sv.Direction) {
    switch (direction) {
      case sv.Direction.North:
        return {
          x: -1.1245,
          y: 0.226,
          z: -0.097,
          rot: 81,
        };
      case sv.Direction.South:
        return {
          x: 1.1245,
          y: 0.226,
          z: 0.097,
          rot: 260,
        };
      case sv.Direction.East:
        return {
          x: 0.097,
          y: 0.226,
          z: -1.1245,
          rot: 171,
        };
      case sv.Direction.West:
        return {
          x: -0.097,
          y: 0.226,
          z: 1.1245,
          rot: 350,
        };
    }
  }

  MiniDirection(direction: sv.Direction) {
    switch (direction) {
      case sv.Direction.North:
        return {
          x: -0.417,
          y: -0.5,
          z: -0.035,
          rot: 81,
        };
      case sv.Direction.South:
        return {
          x: 0.417,
          y: -0.5,
          z: 0.035,
          rot: 260,
        };
      case sv.Direction.East:
        return {
          x: 0.035,
          y: -0.5,
          z: -0.417,
          rot: 171,
        };
      case sv.Direction.West:
        return {
          x: -0.035,
          y: -0.5,
          z: 0.417,
          rot: 350,
        };
    }
  }
}
