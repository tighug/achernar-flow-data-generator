import xlsx from "xlsx";
import fs from "fs";
import { LineCodeData } from "./model/LineCodeData";
import { FeederData } from "./model/FeederData";
import { PositionData } from "./model/PositionData";

export class Reader {
  readFeederFile(path: string): FeederData {
    const json = this.readExcel(path, "Sheet1");

    const feederData = json.map((obj) => {
      const code = String(obj["Cable"]);
      const modCode = code.startsWith("0") ? code.slice(1) : code;

      return {
        prevNodeNum: obj["NodeA"],
        nextNodeNum: obj["NodeB"],
        lengthM: obj["D[m]"],
        phase: obj["Phase"],
        hasLoad: obj["Load"] === 1,
        code: modCode,
      };
    });

    return feederData;
  }

  readPositionFile(path: string): PositionData {
    const json = this.readExcel(path, "Sheet1");

    const positionData = json.map((obj) => {
      return {
        num: obj["Node"],
        posX: obj["X"],
        posY: obj["Y"],
      };
    });

    return positionData;
  }

  readLineCodeFile(path: string): LineCodeData {
    const codePrefix = "LineCode.";
    const xPrefix = "X1=";
    const rPrefix = "R1=";

    const file = fs.readFileSync(path, { encoding: "utf-8" });
    const streams = file.split("\r\n");
    const modStreams = streams.filter((s) => s.length > 0);

    const lineCodeData = modStreams.map((stream) => {
      const items = stream.split(" ");
      const codeItem = items.find((item) => item.startsWith(codePrefix));
      const xItem = items.find((item) => item.startsWith(xPrefix));
      const rItem = items.find((item) => item.startsWith(rPrefix));

      if (!codeItem) throw new Error("codeItem must not be undefined.");
      if (!xItem) throw new Error("xItem must not be undefined.");
      if (!rItem) throw new Error("rItem must not be undefined.");

      const code = codeItem.slice(codePrefix.length);
      const xOhmPerKm = Number(xItem.slice(xPrefix.length));
      const rOhmPerKm = Number(rItem.slice(rPrefix.length));

      return { code, xOhmPerKm, rOhmPerKm };
    });

    return lineCodeData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readExcel(path: string, sheetName: string): any[] {
    const workbook = xlsx.readFile(path);
    const sheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(sheet);

    return json;
  }
}
