import { Sample } from "../model/Sample";

export class SampleFactory {
  private id = 1;

  create(props: SampleProps, season: "summer" | "winter"): Sample {
    const amount = props.time * 5;
    return {
      id: this.id++,
      hour: Math.floor(amount / 60),
      minute: amount % 60,
      num: props.num + 1,
      val: props.val,
      season,
    };
  }
}

type SampleProps = {
  num: number;
  time: number;
  val: number;
};
