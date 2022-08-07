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
    readonly processService: ProcessService;
    readonly twitchService: TwitchService;
    openEnabled = true;

    constructor(props: unknown) {
        super(props);

        this.processService = new ProcessService(window.ipcAPI.api.getConfig);
        this.twitchService = new TwitchService(window.ipcAPI.api.getConfig);

        this.refreshLivestreams = this.refreshLivestreams.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.qualityChanged = this.qualityChanged.bind(this);

        this.state = {
            channels: [],
            quality: 1,
        };
    }

    async componentDidMount(): Promise<void> {
        await this.refreshLivestreams();
    }

    onCardClick(channel: LiveChannel) {
        if (this.openEnabled) {
            this.openEnabled = false;
            console.log(`Sending command to open stream channel: ${channel.url}`);
            this.processService.openStream(channel.url, this.state.quality);
            setTimeout(() => this.openEnabled = true, 2000);
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

    calculateRuntime(startedAt: string): string {
        const elapsedTime = new Date().getTime().valueOf() - +(Date.parse(startedAt).valueOf());
        const hoursDecimal = elapsedTime / (1000 * 60 * 60);
        const runTime = new Date(0, 0);
        runTime.setMinutes(+hoursDecimal * 60);
        return `${runTime.getHours()}h ${runTime.getMinutes()}m`;
    }

    qualityChanged(e: SelectChangeEvent<number>, _n: React.ReactNode): void {
        this.setState({ quality: e.target.value as number });
    }

    render(): React.ReactNode {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexFlow: 'column' }}>
                <div style={{ marginBottom: '10px', height: '100%', backgroundColor: '#383838' }}>
                    <Grid container rowSpacing={1} columnSpacing={1} style={{ height: 'auto', padding: '10px' }}>
                        {Array.from(this.state.channels).map((x, index) => (
                            <Grid item key={index}>
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
                    <Link to="/settings">
                        <Button variant="contained">
                            <SettingsIcon />
                        </Button>
                    </Link>
                    <FormControl variant="standard">
                        <InputLabel>Quality</InputLabel>
                        <Select
                            id="quality-select"
                            value={this.state.quality}
                            label="Quality"
                            defaultValue={1}
                            onChange={this.qualityChanged}>
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
