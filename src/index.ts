import path from "path";
import fs from "fs";
import { Reader } from "./Reader";
import { Converter } from "./Converter";
import { Serializer } from "./Serializer";
import { Writer } from "./Writer";
import { FeederArray } from "./model/FeederArray";
import { LineArray } from "./model/LineArray";
import { NodeArray } from "./model/NodeArray";

function main(): void {
  const resourcePath = path.resolve(__dirname, "../resource");
  const networkCount = countNetwork(resourcePath);
  const reader = new Reader();
  const converter = new Converter();
  const serializer = new Serializer();
  const writer = new Writer();
  const allFeederArray: FeederArray = [];
  const allNodeArray: NodeArray = [];
  const allLineArray: LineArray = [];

  for (let n = 1; n <= networkCount; n++) {
    const nerworkDirPath = path.join(resourcePath, `network_${n}`);
    const feederCount = countFeeder(nerworkDirPath);

    for (let f = 1; f <= feederCount; f++) {
      const feederDirPath = path.join(nerworkDirPath, `Feeder_${f}`);
      const feederFilePath = path.join(feederDirPath, "Feeder_Data.xls");
      const positionFilePath = path.join(feederDirPath, "XY_Position.xls");
      const lineCodeFilePath = path.join(feederDirPath, "LineCode.txt");

      // Read files
      const feederData = reader.readFeederFile(feederFilePath);
      const positionData = reader.readPositionFile(positionFilePath);
      const lineCodeData = reader.readLineCodeFile(lineCodeFilePath);

      // Convert datas into models
      const feeder = converter.toFeeder(n, f);
      const nodes = converter.toNodes(feeder.id, feederData, positionData);
      const lines = converter.toLines(
        feeder.id,
        nodes,
        feederData,
        lineCodeData
      );

      // Serialize nodes & lines
      const feederArray = serializer.feederToArray(feeder);
      const nodeArray = serializer.nodesToArray(nodes);
      const lineArray = serializer.lineToArray(lines);

      allFeederArray.push(feederArray);
      allNodeArray.push(...nodeArray);
      allLineArray.push(...lineArray);
    }
  }

  // Write
  const outPath = path.resolve(__dirname, "../out");
  const outFeedersPath = path.join(outPath, "Feeders.csv");
  const outNodesPath = path.join(outPath, "Nodes.csv");
  const outLinesPath = path.join(outPath, "Lines.csv");
  if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
  writer.writeFeeders(allFeederArray, outFeedersPath);
  writer.writeNodes(allNodeArray, outNodesPath);
  writer.writeLines(allLineArray, outLinesPath);
}

function countNetwork(resourcePath: string): number {
  const resourceItems = fs.readdirSync(resourcePath);
  const networkDirs = resourceItems.filter((item) => {
    const stats = fs.statSync(path.join(resourcePath, item));
    const isDir = stats.isDirectory();
    const isNetwork = item.startsWith("network_");
    return isDir && isNetwork;
  });
  return networkDirs.length;
}

function countFeeder(networkDirPath: string): number {
  const networkDirItems = fs.readdirSync(networkDirPath);
  const feederDirs = networkDirItems.filter((item) => {
    const stats = fs.statSync(path.join(networkDirPath, item));
    const isDir = stats.isDirectory();
    const isNetwork = item.startsWith("Feeder_");
    return isDir && isNetwork;
  });
  return feederDirs.length;
}

main();
