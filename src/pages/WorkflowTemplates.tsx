import { Container, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import requests from '../api/requests';
import { WorkflowTemplate } from '../models/workflow-templates';

function WorkflowTemplates() {
    const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([])
    const [activeWf, setActiveWf] = useState<null | string>(null)
    const [wfTemplate, setWfTemplate] = useState<WorkflowTemplate | null>(null);

    useEffect(() => {
        requests.get("api/v1/workflow-templates/argo").then(res => {
            console.log(res.body);
            setWorkflowTemplates(res.body.items)
        })
    }, [])


    return (
        <Container maxWidth="lg">

            <Grid container spacing={2}>
                <Grid item xs={4}>

                    <List dense={false} style={{
                        maxHeight: "85vh",
                        overflow: "scroll",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    }}>
                        {workflowTemplates.map((template, i) => (
                            <ListItem key={template.metadata.uid} style={{
                                boxShadow: activeWf === template.metadata.name ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "",
                                cursor: "pointer",
                            }}

                                onClick={e => {
                                    setActiveWf(template?.metadata?.name || null)
                                    setWfTemplate(template)
                                }}
                            >
                                <ListItemIcon>
                                    <AccountTreeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={template.metadata.name}
                                    secondary={"Namespace: " + template.metadata.namespace}
                                />
                            </ListItem>

                        ))}
                    </List>
                </Grid>
                <Grid item xs={8}>
                    {wfTemplate && (
                        <List dense={true} style={{
                            maxHeight: "85vh",
                            overflow: "scroll",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                        }}>
                            {wfTemplate?.spec?.templates?.map((template, i) => (
                                <ListItem key={template.name} style={{
                                    // boxShadow: activeWf === template.metadata.name ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "",
                                    cursor: "pointer",
                                }}

                                // onClick={e => {
                                //     setActiveWf(template?.metadata?.name || null)
                                //     setWfTemplate(template)
                                // }}
                                >
                                    <ListItemIcon>
                                        <AutoAwesomeMosaicIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={template.name}
                                        secondary={<div>
                                            <div>Inputs</div>
                                            {template.inputs?.parameters?.map((p, i) => (
                                                <li>- {p.name}</li>
                                            ))}
                                            {(template?.outputs?.parameters?.length || 0) > 0 && (
                                                <div>Outputs</div>
                                            )}
                                            {template.outputs?.parameters?.map((p, i) => (
                                                <li>- {p.name}</li>
                                            ))}
                                        </div>}
                                    />
                                </ListItem>

                            ))}
                        </List>
                    )}
                </Grid>
            </Grid>
        </Container>
    )
}

export default WorkflowTemplates