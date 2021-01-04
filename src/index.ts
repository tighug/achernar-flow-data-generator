import path from "path";
import { Reader } from "./Reader";
import { Converter } from "./Converter";
import { Serializer } from "./Serializer";
import { Writer } from "./Writer";
import { FeederFactory } from "./factory/FeederFactory";
import { NodeFactory } from "./factory/NodeFactory";
import { LineFactory } from "./factory/LineFactory";
import { LVNController } from "./LVNController";
import { LCTController } from "./LCTController";

function main(): void {
  const resourcePath = path.resolve(__dirname, "../resource");
  const lvnDirPath = path.join(resourcePath, "lvn");
  const lctDirPath = path.join(resourcePath, "lct");
  const feederFactory = new FeederFactory();
  const nodeFactory = new NodeFactory();
  const lineFactory = new LineFactory();
  const reader = new Reader();
  const converter = new Converter(feederFactory, nodeFactory, lineFactory);
  const serializer = new Serializer();
  const writer = new Writer();
  const lvnController = new LVNController(
    reader,
    converter,
    serializer,
    writer
  );
  const lctController = new LCTController(
    reader,
    converter,
    serializer,
    writer
  );

  lvnController.execute(lvnDirPath);
  lctController.execute(lctDirPath);
}

main();
