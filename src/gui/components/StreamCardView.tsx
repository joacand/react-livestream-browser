
import * as React from 'react';
import { DataGrid, GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import { ProcessService } from "../../services/ProcessService";
import { TwitchService, LiveChannel } from "../../services/TwitchService";
import { Config } from '../../core/Config'
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { alpha, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, gridClasses, Stack, styled, Typography } from '@mui/material';

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            getConfig: () => Config;
        }
    }
}

const config = window.api.getConfig();

export class StreamCardView extends React.Component<unknown, { rows: any, channels: LiveChannel[] }> {

    readonly processService: ProcessService;
    readonly twitchService: TwitchService;
    openEnabled = true;

    constructor(props: unknown) {
        super(props);

        this.processService = new ProcessService(config);
        this.twitchService = new TwitchService(config);

        this.refreshLivestreams = this.refreshLivestreams.bind(this);
        this.onCardClick = this.onCardClick.bind(this);

        this.state = {
            rows: [],
            channels: []
        }
    }

    componentDidMount(): void {
        this.refreshLivestreams();
    }

    onCardClick(channel: LiveChannel) {
        if (this.openEnabled) {
            this.openEnabled = false;
            console.log("Sending command to open stream channel: " + channel.url);
            this.processService.openStream(channel.url);
            setTimeout(() => this.openEnabled = true, 2000);
        }
    }

    async refreshLivestreams(): Promise<void> {
        this.setState({
            rows: [],
            channels: []
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
            rows: newResult,
            channels: result
        });
    }

    openSettings(): void {
        console.log("test");

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
            <div style={{ width: 'auto', height: '100%' }}>
                <div style={{ marginBottom: '10px', width: 'auto', height: '100%' }}>
                    <Grid container rowSpacing={1} columnSpacing={1} style={{ backgroundColor: '#4527a0', height: '100%' }}>
                        {Array.from(this.state.channels).map((x, index) => (
                            <Grid item key={index}>
                                <Card sx={{ minWidth: 345, maxWidth: 345 }}>
                                    <CardActionArea onClick={() => this.onCardClick(x)}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={x.bitmapUrl}
                                            alt="thumbnail"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {x.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {x.title}<br />
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {x.game}, {x.viewers} viewers
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>

                <Stack direction="row" alignItems="center" gap={1}>
                    <Button variant="contained" onClick={this.refreshLivestreams}>
                        <RefreshIcon />
                    </Button>
                    <Button variant="contained" onClick={this.openSettings}>
                        <SettingsIcon />
                    </Button>
                </Stack>
            </div>
        )
    }
}
