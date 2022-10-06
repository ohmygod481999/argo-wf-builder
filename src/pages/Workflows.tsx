import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Container, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow';
import requests from '../api/requests';
import { NodePhase, Workflow } from '../models/workflows';

const initialNodes: any = [
    // { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    // { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges: any = [
    // { id: 'e1-2', source: '1', target: '2' }
];

const nodeColor: { [x in NodePhase]: string } = {
    Error: "#E96D76",
    Failed: "#E96D76",
    Running: "#0DADEA",
    Omitted: "yellow",
    Skipped: "grey",
    Pending: "#f4c030",
    Succeeded: "#18BE94",
    "": "grey"
}

function Workflows() {
    const [workflows, setWorkflows] = useState<Workflow[]>([])
    const [activeWf, setActiveWf] = useState<null | string>(null)
    const [workflow, setWorkflow] = useState<Workflow | null>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds: any) => addEdge(params, eds))
        , [setEdges]
    );


    useEffect(() => {
        requests.get("api/v1/workflows/argo").then(res => {
            console.log(res.body);
            setWorkflows(res.body.items)
        })

        // const observable = requests
        //   .loadEventSource("api/v1/workflow-events/argo?listOptions.fieldSelector=metadata.namespace=argo,metadata.name=coinflip-recursive-qbrtx")
        //   .pipe(map(data => data && (JSON.parse(data).result)));
        // observable.subscribe(e => console.log(e))
    }, [])

    useEffect(() => {
        if (workflow && workflow.status?.nodes) {
            const nodes = Object.keys(workflow.status.nodes || [])
            setNodes(nodes.map((node, i) => ({
                id: node,
                position: {
                    x: 0,
                    y: i * 150,
                },
                data: {
                    label: node
                },
                style: {
                    backgroundColor: nodeColor[workflow.status?.nodes[node].phase || "Pending"],
                    color: workflow.status?.nodes[node].phase === "Failed" ? "#fff" : "#000",
                    fontSize: 20
                }
            })))
            const edges: any[] = []
            nodes.forEach(node => {
                if (workflow.status?.nodes[node] && "children" in workflow.status?.nodes[node]) {
                    workflow.status?.nodes[node]?.children.forEach(child => {
                        edges.push({ id: node + "-" + child, source: node, target: child })
                    })
                }
            })
            setEdges(edges)

        }
    }, [workflow])


    useEffect(() => {
        let eventSource: EventSource
        if (activeWf) {
            console.log("run");
            const url = `http://10.124.69.230:3000/api/v1/workflow-events/argo?listOptions.fieldSelector=metadata.namespace=argo,metadata.name=${activeWf}`

            eventSource = new EventSource(url);
            eventSource.onopen = () => console.log(null);
            eventSource.onmessage = x => {
                const e = JSON.parse(x.data)
                const wf: Workflow = e.result.object
                console.log(wf?.status?.nodes);
                setWorkflow(wf)
            };
            eventSource.onerror = x => {
                switch (eventSource.readyState) {
                    case EventSource.CONNECTING:
                        console.error(new Error('Failed to connect to ' + url));
                        break;
                    case EventSource.OPEN:
                        console.error(new Error('Error in open connection to ' + url));
                        break;
                    case EventSource.CLOSED:
                        console.error(new Error('Connection closed to ' + url));
                        break;
                    default:
                        console.error(new Error('Unknown error with ' + url));
                }
            };
        }

        return () => {
            if (eventSource) {
                console.log("delete");
                eventSource.close()
            }
        }
    }, [activeWf])
    return (
        <Container maxWidth="lg">

            <Grid container spacing={2}>
                <Grid item xs={4}>

                    <List dense={true} style={{
                        maxHeight: "85vh",
                        overflow: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    }}>
                        {workflows.map((workflow, i) => (
                            <ListItem key={workflow.metadata.uid} style={{
                                boxShadow: activeWf === workflow.metadata.name ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "",
                                cursor: "pointer",
                            }}

                                onClick={e => {
                                    setActiveWf(workflow?.metadata?.name || null)
                                }}
                            >
                                <ListItemIcon>
                                    <AccountTreeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={workflow.metadata.name}
                                    secondary={"Namespace: " + workflow.metadata.namespace}
                                />
                            </ListItem>

                        ))}
                    </List>
                </Grid>
                <Grid item xs={8}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                    >
                        <MiniMap />
                        <Controls />
                        <Background />
                    </ReactFlow>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Workflows