import { Line } from "../model/Line";

export class LineFactory {
  private id = 1;

  create(props: LineProps): Line {
    return {
      id: this.id++,
      ...props,
    };
  }
}

type LineProps = {
  readonly feederId: number;
  readonly prevNodeId: number;
  readonly nextNodeId: number;
  readonly lengthM: number;
  readonly phase: number;
  readonly code: string;
  readonly rOhmPerKm: number;
  readonly xOhmPerKm: number;
};
