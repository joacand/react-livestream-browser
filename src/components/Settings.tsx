
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Stack, TextField } from '@mui/material';
import { Config } from '_/core/Config';
import * as React from 'react';
import { Link } from 'react-router-dom';

const config: Config = window.ipcAPI.api.getConfig();
const saveConfig = window.ipcAPI.api.setConfig;

export class Settings extends React.Component<unknown, {
    twitchClientId: string, twitchUserId: string,
    twitchUserName: string, streamUtilityPath: string
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            twitchClientId: config.twitchClientId,
            twitchUserId: config.twitchUserId,
            twitchUserName: config.twitchUserName,
            streamUtilityPath: config.streamUtilityPath,
        };
    }

    handleChangeClientId = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchClientId: event.currentTarget.value }); };
    handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchUserId: event.currentTarget.value }); };
    handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchUserName: event.currentTarget.value }); };
    handleChangeStreamUtilityPath = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ streamUtilityPath: event.currentTarget.value }); };

    saveChanges(): void {
        try {
            const {
                twitchClientId, twitchUserId, twitchUserName, streamUtilityPath,
            } = this.state;

            config.twitchClientId = twitchClientId;
            config.twitchUserId = twitchUserId;
            config.twitchUserName = twitchUserName;
            config.streamUtilityPath = streamUtilityPath;

            saveConfig(config);
        } catch (error) {
            console.error(error);
        }
    }
    render(): React.ReactNode {
        const {
            twitchClientId, twitchUserId, twitchUserName, streamUtilityPath,
        } = this.state;

        return (
            <div className="container_root">
                <h1>Application settings</h1>
                <div style={{ height: '100%' }}>
                    <Stack direction="column" alignItems="left" gap={1} style={{ paddingBottom: '10px' }}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Twitch client ID"
                            defaultValue={twitchClientId}
                            onChange={this.handleChangeClientId}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Twitch user ID (numbers)"
                            defaultValue={twitchUserId}
                            onChange={this.handleChangeUserId}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Twitch user name"
                            defaultValue={twitchUserName}
                            onChange={this.handleChangeUserName}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Streamlink path"
                            defaultValue={streamUtilityPath}
                            onChange={this.handleChangeStreamUtilityPath}
                        />
                    </Stack>
                </div>

                <Stack direction="column" alignItems="left" gap={1} style={{ paddingBottom: '10px' }}>
                    <Link to="/oauthTwitch" style={{ textDecoration: 'none' }}>
                        <Button variant="contained">
                            Authenticate to Twitch
                        </Button>
                    </Link>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Link to="/" onClick={() => this.saveChanges()}>
                            <Button variant="contained">
                                <SaveIcon />
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="contained">
                                <CancelIcon />
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </div>
        );
    }
}
