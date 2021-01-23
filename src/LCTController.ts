import path from "path";
import { Converter } from "./Converter";
import { Reader } from "./Reader";
import { Writer } from "./Writer";
import { Serializer } from "./Serializer";

export class LCTController {
  constructor(
    private readonly reader: Reader,
    private readonly converter: Converter,
    private readonly serializer: Serializer,
    private readonly writer: Writer
  ) {}

  execute(lctDirPath: string): void {
    const summerLoadPath = path.join(lctDirPath, "Summer_Load_Profiles.xlsx");
    const summerPVPath = path.join(lctDirPath, "Summer_PV_Profiles.xlsx");
    const winterEHPPath = path.join(lctDirPath, "Winter_EHP_Profiles.xlsx");
    const winterLoadPath = path.join(lctDirPath, "Winter_Load_Profiles.xlsx");
    const winterUCHPPath = path.join(lctDirPath, "Winter_Load_Profiles.xlsx");

    // Read files
    const summerLoadData = this.reader.readProfileFile(summerLoadPath);
    const summerPVData = this.reader.readProfileFile(summerPVPath);
    const winterEHPData = this.reader.readProfileFile(winterEHPPath);
    const winterLoadData = this.reader.readProfileFile(winterLoadPath);
    const winterUCHPData = this.reader.readProfileFile(winterUCHPPath);

    // Convert datas into models
    const sloads = this.converter.toSamples(summerLoadData, "summer", "load");
    const wloads = this.converter.toSamples(winterLoadData, "winter", "load");
    const pvs = this.converter.toSamples(summerPVData, "summer", "pv");
    const ehps = this.converter.toSamples(winterEHPData, "winter", "ehp");
    const uchps = this.converter.toSamples(winterUCHPData, "winter", "uchp");

    // Serialize
    const sampleArray = this.serializer.samplesToArray([
      ...sloads,
      ...wloads,
      ...pvs,
      ...ehps,
      ...uchps,
    ]);

    const outPath = path.resolve(__dirname, "../out");
    const outSamplesPath = path.join(outPath, "samples.csv");

    this.writer.writeSamples(sampleArray, outSamplesPath);
  }
}
