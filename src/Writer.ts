import fs from "fs";
import { FeederArray } from "./model/FeederArray";
import { LineArray } from "./model/LineArray";
import { NodeArray } from "./model/NodeArray";
import { ProfileArray } from "./model/ProfileArray";

export class Writer {
  writeFeeders(feederArray: FeederArray, path: string): void {
    this.toCSV(feederArray, path);
  }

  writeNodes(nodeArray: NodeArray, path: string): void {
    this.toCSV(nodeArray, path);
  }

  writeLines(lineArray: LineArray, path: string): void {
    this.toCSV(lineArray, path);
  }

  writeProfiles(profileArray: ProfileArray, path: string): void {
    this.toCSV(profileArray, path);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toCSV(contentArray: any[][], path: string): void {
    let data = "";

    for (let i = 0; i < contentArray.length; i++) {
      const val = contentArray[i];

      for (let j = 0; j < val.length; j++) {
        const innerVal = val[j] === null ? "" : val[j].toString();
        let result = innerVal.replace(/"/g, '""');

        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) data += ",";

        data += result;
      }

      data += "\n";
    }

    fs.writeFile(path, data, "utf8", (err) => {
      if (err) throw new Error(err.message);

      console.log("success");
    });
  }
}
