import { Button, Container, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    ReactFlowProvider,
    MiniMap,
    Controls,
    Background,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import requests from '../api/requests';
import { WfNode } from '../models/graph';
import { WorkflowTemplate } from '../models/workflow-templates';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';

import './index.css';
import { WfNodeFlow } from '../components/WfNode';

const nodeTypes = {
    wfNode: WfNodeFlow
}

function TemplateBuilder() {
    const [wfNodes, setWfNodes] = useState<WfNode[]>([])

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    const onConnect = useCallback(
        (params: any) => setEdges((eds: any) => {
            return addEdge({
                ...params,
                type: 'step',
                label: "long"
            }, eds)
        })
        , [setEdges]
    );

    const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([])

    useEffect(() => {
        requests.get("api/v1/workflow-templates/argo").then(res => {
            setWorkflowTemplates(res.body.items)
        })
    }, [])

    const addNode = useCallback(
        (wfNode: WfNode) => {
            if (!nodes.map(node => node.id).includes(wfNode.id)) {
                setNodes([
                    ...nodes,
                    {
                        id: wfNode.id,
                        position: { x: 0, y: 0 },
                        data: { 
                            label: wfNode.name,
                            ...wfNode
                        },
                        type: 'wfNode',
                        sourcePosition: Position.Left,
                        targetPosition: Position.Right
                    }
                ])
            }
            else {
                alert("Template đã tồn tại")
            }
        },
        [nodes],
    )


    useEffect(() => {
        if (workflowTemplates) {
            const nodes: WfNode[] = []
            workflowTemplates.forEach(wfTemplate => {
                wfTemplate.spec.templates?.map(template => {
                    const node = new WfNode(wfTemplate.metadata.name + "-" + template.name || "", template.name || "", wfTemplate.metadata.name || "")
                    template.inputs?.parameters?.map(param => {
                        node.addInput({
                            name: param.name,
                            value: param.value || ""
                        })
                    })
                    template.outputs?.parameters?.map(param => {
                        node.addOutput({
                            name: param.name
                        })
                    })
                    nodes.push(node)
                })
            })

            setWfNodes(nodes);
        }
    }, [workflowTemplates])



    return (
        <Container maxWidth="lg">

            <Grid container spacing={2}>
                <Grid item xs={4}>

                    <List dense={true} style={{
                        height: "85vh",
                        overflow: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    }}>
                        {wfNodes.map((wfNode, i) => (
                            <ListItem key={wfNode.id} style={{
                                cursor: "pointer",
                            }}

                                onClick={e => {
                                    addNode(wfNode)
                                }}
                            >
                                <ListItemIcon>
                                    <AutoAwesomeMosaicIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={wfNode.name}
                                    secondary={"Template: " + wfNode.template}
                                />
                            </ListItem>

                        ))}
                    </List>
                </Grid>
                <Grid item xs={8}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                    >
                        <MiniMap />
                        <Controls />
                        <Background />
                        <Button 
                            style={{
                                zIndex: 1000
                            }} 
                            variant="contained"
                            onClick={e => {
                                console.log(nodes);
                                console.log(edges);
                            }}    
                        >Submit</Button>
                    </ReactFlow>
                </Grid>
            </Grid>
        </Container>
    )
}

export default TemplateBuilder