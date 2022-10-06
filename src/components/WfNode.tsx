import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { WfNode } from '../models/graph';
import "./index.css"


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));


export const WfNodeFlow = memo(({ data, isConnectable }: {
    data: WfNode
    isConnectable: boolean
}) => {
    return (
        <>
            <Handle
                type="source"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div className='wf-node'>
                <HtmlTooltip
                    title={
                        <React.Fragment>
                            <Typography color="inherit">Input</Typography>
                            <div>
                                {data.inputs.length === 0 && "Trống"}
                                {data.inputs.map((input, i) => (
                                    <li key={i}>{input.name}</li>
                                ))}
                            </div>
                        </React.Fragment>
                    }
                >
                    <span className='node-param-info in'></span>
                </HtmlTooltip>
                {data.name}
                <HtmlTooltip
                    title={
                        <React.Fragment>
                            <Typography color="inherit">Output</Typography>
                            <div>
                                {data.outputs.length === 0 && "<Trống>"}
                                {data.outputs.map((input, i) => (
                                    <li key={i}>{input.name}</li>
                                ))}
                            </div>
                        </React.Fragment>
                    }
                >
                    <span className='node-param-info out'></span>
                </HtmlTooltip>
            </div>
            <Handle
                type="target"
                position={Position.Right}
                id="a"
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />
            {/* <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 15, background: '#555' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 8, top: 'auto', background: '#555' }}
        isConnectable={isConnectable}
      /> */}
        </>
    );
});
