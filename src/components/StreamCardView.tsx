/* eslint-disable @typescript-eslint/no-misused-promises */
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Button, Card, CardActionArea, CardContent, CardMedia, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography,
} from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { LiveChannel } from '../core/LiveChannel';
import { ProcessService } from '../services/ProcessService';
import { TwitchService } from '../services/TwitchService';

export class StreamCardView extends React.Component<unknown, { channels: LiveChannel[], quality: number }> {
    static calculateRuntime(startedAt: string): string {
        const elapsedTime = new Date().getTime().valueOf() - +(Date.parse(startedAt).valueOf());
        const hoursDecimal = elapsedTime / (1000 * 60 * 60);
        const runTime = new Date(0, 0);
        runTime.setMinutes(+hoursDecimal * 60);
        return `${runTime.getHours()}h ${runTime.getMinutes()}m`;
    }

    readonly twitchService: TwitchService;
    readonly processService: ProcessService;
    openEnabled = true;

    constructor(props: unknown) {
        super(props);

        this.processService = new ProcessService(window.ipcAPI.api.getConfig);
        this.twitchService = new TwitchService(window.ipcAPI.api.getConfig);

        this.state = {
            channels: [],
            quality: 1,
        };
    }

    async componentDidMount(): Promise<void> {
        await this.refreshLivestreams();
    }

    onCardClick(channel: LiveChannel) {
        const { quality } = this.state;
        if (this.openEnabled) {
            this.openEnabled = false;
            console.log(`Sending command to open stream channel: ${channel.url}`);
            this.processService.openStream(channel.url, quality);
            setTimeout(() => { this.openEnabled = true; }, 2000);
        }
    }

    async refreshLivestreams(): Promise<void> {
        this.setState({
            channels: [],
        });

        const result = await this.twitchService.getLiveChannels();

        this.setState({
            channels: result,
        });
    }

    qualityChanged(e: SelectChangeEvent<number>, _n: React.ReactNode): void {
        this.setState({ quality: e.target.value as number });
    }

    render(): React.ReactNode {
        const {
            channels, quality,
        } = this.state;

        return (
            <div className="container_root">
                <div className="scroll_enabled card_grid">
                    <Grid className="card_grid_internal" container rowSpacing={1} columnSpacing={1}>
                        {Array.from(channels).map((x) => (
                            <Grid item key={x.channelId}>
                                <Card sx={{ minWidth: 345, maxWidth: 345, minHeight: 290 }}>
                                    <CardActionArea onClick={() => this.onCardClick(x)}>
                                        <CardMedia
                                            component="img"
                                            height="150"
                                            image={x.bitmapUrl}
                                            alt="thumbnail"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {x.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {x.title}<br />
                                                {x.game}, {x.viewers} viewers<br />
                                                Started {StreamCardView.calculateRuntime(x.runTime)} ago
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>

                <Stack direction="row" alignItems="center" gap={1}>
                    <Button variant="contained" onClick={() => this.refreshLivestreams()}>
                        <RefreshIcon />
                    </Button>
                    <Link to="/settings">
                        <Button variant="contained">
                            <SettingsIcon />
                        </Button>
                    </Link>
                    <FormControl variant="standard">
                        <InputLabel>Quality</InputLabel>
                        <Select
                            id="quality-select"
                            value={quality}
                            label="Quality"
                            defaultValue={1}
                            onChange={(e, c) => this.qualityChanged(e, c)}
                        >
                            <MenuItem value={1}>High</MenuItem>
                            <MenuItem value={2}>Medium</MenuItem>
                            <MenuItem value={3}>Low</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </div>
        );
    }
}
