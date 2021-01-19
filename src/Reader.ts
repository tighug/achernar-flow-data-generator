import xlsx, { utils } from "xlsx";
import fs from "fs";
import { LineCodeData } from "./model/LineCodeData";
import { FeederData } from "./model/FeederData";
import { PositionData } from "./model/PositionData";
import { SampleData } from "./model/SampleData";

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
        hasLoad: obj["Load"],
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

  readProfileFile(path: string): SampleData {
    const array = this.readProfile(path, "Sheet1");
    const profiles: SampleData = [];

    array.forEach((column, c) => {
      column.forEach((val, r) => {
        profiles.push({ num: c, time: r, val });
      });
    });

    return profiles;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readExcel(path: string, sheetName: string): any[] {
    const workbook = xlsx.readFile(path);
    const sheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(sheet);

    return json;
  }

  private readProfile(path: string, sheetName: string): number[][] {
    const workbook = xlsx.readFile(path);
    const sheet = workbook.Sheets[sheetName];
    const range = sheet["!ref"];

    if (!range) throw new Error("range is undefined.");

    const decodeRange = utils.decode_range(range);
    const array: number[][] = [];

    for (
      let colIndex = decodeRange.s.c;
      colIndex <= decodeRange.e.c;
      colIndex++
    ) {
      const columns: number[] = [];
      for (
        let rowIndex = decodeRange.s.r;
        rowIndex <= decodeRange.e.r;
        rowIndex++
      ) {
        const address = utils.encode_cell({ r: rowIndex, c: colIndex });
        const cell = sheet[address];

        columns.push(cell.v);
      }
      array.push(columns);
    }

    return array;
  }
}
