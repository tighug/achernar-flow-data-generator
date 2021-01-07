import path from "path";
import fs from "fs";
import { Converter } from "./Converter";
import { Reader } from "./Reader";
import { Writer } from "./Writer";
import { Serializer } from "./Serializer";
import { FeederArray } from "./model/FeederArray";
import { LineArray } from "./model/LineArray";
import { NodeArray } from "./model/NodeArray";

export class LVNController {
  constructor(
    private readonly reader: Reader,
    private readonly converter: Converter,
    private readonly serializer: Serializer,
    private readonly writer: Writer
  ) {}

  execute(lvnDirPath: string): void {
    const networkCount = this.countNetwork(lvnDirPath);
    const allFeederArray: FeederArray = [];
    const allNodeArray: NodeArray = [];
    const allLineArray: LineArray = [];

    // Read LVN models
    for (let n = 1; n <= networkCount; n++) {
      const nerworkDirPath = path.join(lvnDirPath, `network_${n}`);
      const feederCount = this.countFeeder(nerworkDirPath);

      for (let f = 1; f <= feederCount; f++) {
        const feederDirPath = path.join(nerworkDirPath, `Feeder_${f}`);
        const feederFilePath = path.join(feederDirPath, "Feeder_Data.xls");
        const positionFilePath = path.join(feederDirPath, "XY_Position.xls");
        const lineCodeFilePath = path.join(feederDirPath, "LineCode.txt");

        // Read files
        const feederData = this.reader.readFeederFile(feederFilePath);
        const positionData = this.reader.readPositionFile(positionFilePath);
        const lineCodeData = this.reader.readLineCodeFile(lineCodeFilePath);

        // Convert datas into models
        const feeder = this.converter.toFeeder(n, f);
        const nodes = this.converter.toNodes(
          feeder.id,
          feederData,
          positionData
        );
        const lines = this.converter.toLines(nodes, feederData, lineCodeData);

        // Serialize models
        const feederArray = this.serializer.feederToArray(feeder);
        const nodeArray = this.serializer.nodesToArray(nodes);
        const lineArray = this.serializer.linesToArray(lines);

        allFeederArray.push(feederArray);
        allNodeArray.push(...nodeArray);
        allLineArray.push(...lineArray);
      }
    }

    // Write
    const outPath = path.resolve(__dirname, "../out");
    const outFeedersPath = path.join(outPath, "feeders.csv");
    const outNodesPath = path.join(outPath, "nodes.csv");
    const outLinesPath = path.join(outPath, "lines.csv");
    if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
    this.writer.writeFeeders(allFeederArray, outFeedersPath);
    this.writer.writeNodes(allNodeArray, outNodesPath);
    this.writer.writeLines(allLineArray, outLinesPath);
  }

  private countNetwork(resourcePath: string): number {
    const resourceItems = fs.readdirSync(resourcePath);
    const networkDirs = resourceItems.filter((item) => {
      const stats = fs.statSync(path.join(resourcePath, item));
      const isDir = stats.isDirectory();
      const isNetwork = item.startsWith("network_");
      return isDir && isNetwork;
    });
    return networkDirs.length;
  }

  private countFeeder(networkDirPath: string): number {
    const networkDirItems = fs.readdirSync(networkDirPath);
    const feederDirs = networkDirItems.filter((item) => {
      const stats = fs.statSync(path.join(networkDirPath, item));
      const isDir = stats.isDirectory();
      const isNetwork = item.startsWith("Feeder_");
      return isDir && isNetwork;
    });
    return feederDirs.length;
  }
}
