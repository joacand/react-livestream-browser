
import * as React from 'react';
import { DataGrid, GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import { ProcessService } from "../../services/ProcessService";
import { TwitchService, LiveChannel } from "../../services/TwitchService";
import { Config } from '../../core/Config'
import RefreshIcon from '@mui/icons-material/Refresh';
import { alpha, Button, gridClasses, Stack, styled } from '@mui/material';

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            getConfig: () => Config;
        }
    }
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    backgroundColor: '#4527a0',
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `0px solid
            }`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `0px solid
            }`,
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
}));


const config = window.api.getConfig();

const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Channel', width: 150, flex: 2 },
    { field: 'col2', headerName: 'Title', width: 150, flex: 5 },
    { field: 'col3', headerName: 'Game', width: 150, flex: 3 },
    { field: 'col4', headerName: 'Viewers', width: 150, flex: 1 },
    { field: 'col5', headerName: 'Runtime', width: 150, flex: 1 },
    {
        field: 'col6', headerName: 'Thumbnail', width: 150, flex: 3, renderCell: (props: GridRenderCellParams<string>) => {
            const { value } = props;
            return (<img style={{ width: '100%', height: '100%', objectFit: 'none' }} src={value} ></img >)
        }
    },
];

export class StreamListView extends React.Component<unknown, { rows: any }> {

    readonly processService: ProcessService;
    readonly twitchService: TwitchService;

    constructor(props: unknown) {
        super(props);

        this.processService = new ProcessService(config);
        this.twitchService = new TwitchService(config);

        this.refreshLivestreams = this.refreshLivestreams.bind(this);
        this.onRowClick = this.onRowClick.bind(this);

        this.state = {
            rows: []
        }
    }

    componentDidMount(): void {
        this.refreshLivestreams();
    }

    onRowClick(params: GridRowParams) {
        console.log("Sending command to open stream channel: " + params.row["col1"]);
        this.processService.openStream(params.row["col1"]);
    }

    async refreshLivestreams(): Promise<void> {
        this.setState({
            rows: []
        });

        const result = await this.twitchService.getLiveChannels();

        let counter = 1;
        const newResult = result.map((x: LiveChannel) => {
            return {
                id: counter++, col1: x.name, col2: x.title, col3: x.game, col4: x.viewers,
                col5: this.calculateRuntime(x.runTime), col6: x.bitmapUrl
            }
        });

        this.setState({
            rows: newResult
        });
    }

    calculateRuntime(startedAt: string): string {
        const elapsedTime = new Date().getTime().valueOf() - +(Date.parse(startedAt).valueOf());
        const hoursDecimal = elapsedTime / (1000 * 60 * 60);
        const runTime = new Date(0, 0);
        runTime.setMinutes(+hoursDecimal * 60);
        return runTime.getHours() + "h " + runTime.getMinutes() + "m";
    }

    render(): React.ReactNode {
        return (
            <div style={{ height: '80vh', width: 'auto' }}>
                <div style={{ display: 'flex', height: '100%', marginBottom: '10px' }}>
                    <div style={{ flexGrow: 1 }}>
                        <StyledDataGrid rows={this.state.rows} columns={columns} onRowClick={this.onRowClick} />
                    </div>
                </div>

                <Button variant="contained" onClick={this.refreshLivestreams}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <RefreshIcon />
                    </Stack>
                </Button>

            </div>
        )
    }
}
