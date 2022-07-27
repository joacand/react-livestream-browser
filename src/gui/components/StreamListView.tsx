
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import { openStream } from "../../services/ProcessService";
import { TwitchService, LiveChannel } from "../../services/TwitchService";

const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Channel', width: 150, flex: 2 },
    { field: 'col2', headerName: 'Title', width: 150, flex: 5 },
    { field: 'col3', headerName: 'Game', width: 150, flex: 3 },
    { field: 'col4', headerName: 'Viewers', width: 150, flex: 1 },
    { field: 'col5', headerName: 'Runtime', width: 150, flex: 1 },
    {
        field: 'col6', headerName: 'Thumbnail', width: 150, flex: 3, renderCell: (props: GridRenderCellParams<string>) => {
            const { value } = props;
            return (<img style={{ width: '100%', height: '100%' }} src={value} ></img >)
        }
    },
];

export class StreamListView extends React.Component<unknown, { rows: any }> {

    constructor(props: unknown) {
        super(props);

        this.refreshLivestreams = this.refreshLivestreams.bind(this);

        this.state = {
            rows: []
        }
    }

    componentDidMount(): void {
        this.refreshLivestreams();
    }

    onRowClick(params: GridRowParams) {
        console.log("Sending command to open stream channel: " + params.row["col1"]);
        openStream(params.row["col1"]);
    }

    async refreshLivestreams(): Promise<void> {
        this.setState({
            rows: []
        });

        const result = await new TwitchService().getLiveChannels();

        let counter = 1;
        const newResult = result.map((x: LiveChannel) => {
            return { id: counter++, col1: `${x.name}`, col2: x.title, col3: x.game, col4: x.viewers, col5: x.runTime, col6: x.bitmapUrl }
        });

        this.setState({
            rows: newResult
        });
    }

    render(): React.ReactNode {
        return (
            <div style={{ height: '80vh', width: 'auto' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid rows={this.state.rows} columns={columns} onRowClick={this.onRowClick} />
                    </div>
                </div>
                <button onClick={this.refreshLivestreams}>Refresh</button>
            </div>
        )
    }
}
