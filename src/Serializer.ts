import { Feeder } from "./model/Feeder";
import { Node } from "./model/Node";
import { NodeArray } from "./model/NodeArray";
import { Line } from "./model/Line";
import { LineArray } from "./model/LineArray";
import { Sample } from "./model/Sample";
import { SampleArray } from "./model/SampleArray";

export class Serializer {
  feederToArray(feeder: Feeder): [number, number, number] {
    return [feeder.id, feeder.networkNum, feeder.feederNum];
  }

  nodesToArray(nodes: Node[]): NodeArray {
    return nodes.map((j) => [
      j.id,
      j.feederId,
      j.num,
      Number(j.posX.toFixed(4)),
      Number(j.posY.toFixed(4)),
      j.hasLoad,
    ]);
  }

  linesToArray(lines: Line[]): LineArray {
    return lines.map((l) => [
      l.id,
      l.prevNodeId,
      l.nextNodeId,
      Number(l.lengthM.toFixed(4)),
      l.phase,
      l.code,
      l.rOhmPerKm,
      l.xOhmPerKm,
    ]);
  }

  samplesToArray(samples: Sample[]): SampleArray {
    return samples.map((p) => [
      p.id,
      p.num,
      p.hour,
      p.minute,
      Number(p.val.toFixed(4)),
      p.season,
      p.type,
    ]);
  }
}
