export type Sample = {
  id: number;
  num: number;
  hour: number;
  minute: number;
  val: number;
  season: Season;
  type: SampleType;
};

export type Season = "summer" | "winter";
export type SampleType = "load" | "pv" | "ehp" | "uchp";
