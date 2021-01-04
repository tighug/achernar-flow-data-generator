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
    const pvs = this.converter.toProfiles(summerPVData, "summer");
    const ehps = this.converter.toProfiles(winterEHPData, "winter");
    const uchps = this.converter.toProfiles(winterUCHPData, "winter");

    // Serialize
    const loadArray = this.serializer.profilesToArray(loads);
    const pvArray = this.serializer.profilesToArray(pvs);
    const ehpArray = this.serializer.profilesToArray(ehps);
    const uchpArray = this.serializer.profilesToArray(uchps);

    const outPath = path.resolve(__dirname, "../out");
    const outLoadsPath = path.join(outPath, "loads.csv");
    const outPvsPath = path.join(outPath, "pvs.csv");
    const outEhpsPath = path.join(outPath, "ehps.csv");
    const outUchpsPath = path.join(outPath, "uchps.csv");

    this.writer.writeProfiles(loadArray, outLoadsPath);
    this.writer.writeProfiles(pvArray, outPvsPath);
    this.writer.writeProfiles(ehpArray, outEhpsPath);
    this.writer.writeProfiles(uchpArray, outUchpsPath);
  }
}
