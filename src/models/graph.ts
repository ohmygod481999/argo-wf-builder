export const test = 1

// Steps:
// 1: - Build Node and Graph
// 2: - A Node represent a template (which has inputs and outputs)
// 2: - From Node and Graph, create a yaml file

interface Input {
    name: string;
    value: string;
}

interface Output {
    name: string;
    // value: string;
}

export class WfNode {
    id: string;
    name: string;
    template: string;
    inputs: Input[];
    outputs: Output[];
    depends: string[];
    when: string | null;

    constructor(id: string, name: string, template: string) {
        this.id = id
        this.name = name
        this.template = template;
        this.inputs = []
        this.outputs = []
        this.depends = []
        this.when = null
    }

    addInput(input: Input) {
        this.inputs.push(input)
    }

    addOutput(output: Output) {
        this.outputs.push(output)
    }

    addDepend(depend: string) {
        this.depends.push(depend)
    }
}

export class DAG {
    nodes: WfNode[];

    constructor() {
        this.nodes = [];
    }

    addNode(node: WfNode) {
        this.nodes.push(node)
    }

    deleteNode(nodeId: string) {
        this.nodes = this.nodes.filter(node => {
            return node.id !== nodeId
        })
    }
}

