export type Line = {
  readonly id: number;
  readonly feederId: number;
  readonly prevNodeId: number;
  readonly nextNodeId: number;
  readonly lengthM: number;
  readonly phase: number;
  readonly code: string;
  readonly rOhmPerKm: number;
  readonly xOhmPerKm: number;
};
