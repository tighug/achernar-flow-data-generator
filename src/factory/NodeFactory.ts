import { Node } from "../model/Node";

export class NodeFactory {
  private id = 1;

  create(props: NodeProps): Node {
    return {
      id: this.id++,
      ...props,
    };
  }
}

type NodeProps = {
  readonly feederId: number;
  readonly num: number;
  readonly posX: number;
  readonly posY: number;
  readonly hasLoad: boolean;
};
