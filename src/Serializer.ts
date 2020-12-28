import { Feeder } from "./model/Feeder";
import { Node } from "./model/Node";
import { NodeArray } from "./model/NodeArray";
import { Line } from "./model/Line";
import { LineArray } from "./model/LineArray";

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

  lineToArray(lines: Line[]): LineArray {
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
}
