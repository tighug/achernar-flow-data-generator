import { Profile } from "../model/Profile";

export class ProfileFactory {
  private id = 1;

  create(props: ProfileProps, season: "summer" | "winter"): Profile {
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

type ProfileProps = {
  num: number;
  time: number;
  val: number;
};
