import { Feeder } from "./model/Feeder";
import { Node } from "./model/Node";
import { NodeArray } from "./model/NodeArray";
import { Line } from "./model/Line";
import { LineArray } from "./model/LineArray";
import { Profile } from "./model/Profile";
import { ProfileArray } from "./model/ProfileArray";

export class Serializer {
  feederToArray(feeder: Feeder): [number, number, number] {
    return [feeder.id, feeder.networkNum, feeder.feederNum];
  }

  nodesToArray(nodes: Node[]): NodeArray {
    return nodes.map((j) => [
      j.id,
      j.feederId,
      j.num,
      j.posX,
      j.posY,
      j.hasLoad,
    ]);
  }

  linesToArray(lines: Line[]): LineArray {
    return lines.map((l) => [
      l.id,
      l.feederId,
      l.prevNodeId,
      l.nextNodeId,
      l.lengthM,
      l.phase,
      l.code,
      l.rOhmPerKm,
      l.xOhmPerKm,
    ]);
  }

  profilesToArray(profiles: Profile[]): ProfileArray {
    return profiles.map((p) => [
      p.id,
      p.num,
      p.hour,
      p.minute,
      p.val,
      p.season,
    ]);
  }
}
