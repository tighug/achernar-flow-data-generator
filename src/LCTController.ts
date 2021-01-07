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
    const loads = this.converter.toLoads(summerLoadData, winterLoadData);
    const pvs = this.converter.toSamples(summerPVData, "summer");
    const ehps = this.converter.toSamples(winterEHPData, "winter");
    const uchps = this.converter.toSamples(winterUCHPData, "winter");

    // Serialize
    const loadArray = this.serializer.samplesToArray(loads);
    const pvArray = this.serializer.samplesToArray(pvs);
    const ehpArray = this.serializer.samplesToArray(ehps);
    const uchpArray = this.serializer.samplesToArray(uchps);

    const outPath = path.resolve(__dirname, "../out");
    const outLoadsPath = path.join(outPath, "load_samples.csv");
    const outPvsPath = path.join(outPath, "pv_samples.csv");
    const outEhpsPath = path.join(outPath, "ehp_samples.csv");
    const outUchpsPath = path.join(outPath, "uchp_samples.csv");

    this.writer.writeSamples(loadArray, outLoadsPath);
    this.writer.writeSamples(pvArray, outPvsPath);
    this.writer.writeSamples(ehpArray, outEhpsPath);
    this.writer.writeSamples(uchpArray, outUchpsPath);
  }
}
