import { Feeder } from "../model/Feeder";

export class FeederFactory {
  private id = 1;

  create(props: FeederProps): Feeder {
    return {
      id: this.id++,
      ...props,
    };
  }
}

type FeederProps = {
  networkNum: number;
  feederNum: number;
};
