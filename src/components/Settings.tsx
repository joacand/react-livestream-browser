
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Stack, TextField } from '@mui/material';
import { Config } from '_/core/Config';
import * as React from 'react';
import { Link } from 'react-router-dom';

const config: Config = window.ipcAPI.api.getConfig();
const saveConfig = window.ipcAPI.api.setConfig;

export class Settings extends React.Component<unknown, {
    twitchClientId: string, twitchAccessToken: string, twitchUserId: string,
    twitchUserName: string, streamUtilityPath: string
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            twitchClientId: config.twitchClientId,
            twitchAccessToken: config.twitchAccessToken,
            twitchUserId: config.twitchUserId,
            twitchUserName: config.twitchUserName,
            streamUtilityPath: config.streamUtilityPath,
        };
        this.saveChanges = this.saveChanges.bind(this);
    }

    handleChangeClientId = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchClientId: event.currentTarget.value }); }
    handleChangeAccessToken = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchAccessToken: event.currentTarget.value }); }
    handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchUserId: event.currentTarget.value }); }
    handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ twitchUserName: event.currentTarget.value }); }
    handleChangeStreamUtilityPath = (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ streamUtilityPath: event.currentTarget.value }); }

    saveChanges(): void {
        try {
            config.twitchClientId = this.state.twitchClientId;
            config.twitchAccessToken = this.state.twitchAccessToken;
            config.twitchUserId = this.state.twitchUserId;
            config.twitchUserName = this.state.twitchUserName;
            config.streamUtilityPath = this.state.streamUtilityPath;

            saveConfig(config);
        } catch (error) {
            console.log(error);
        }
    }
    render(): React.ReactNode {
        return (
            <div style={{ width: 'auto', height: '100%' }}>
                <Stack direction="column" alignItems="left" gap={1} style={{ paddingBottom: '10px' }}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Twitch client ID"
                        defaultValue={this.state.twitchClientId}
                        onChange={this.handleChangeClientId} />
                    <TextField
                        required
                        id="outlined-required"
                        label="Twitch access token"
                        defaultValue={this.state.twitchAccessToken}
                        onChange={this.handleChangeAccessToken} />
                    <TextField
                        required
                        id="outlined-required"
                        label="Twitch user ID (numbers)"
                        defaultValue={this.state.twitchUserId}
                        onChange={this.handleChangeUserId} />
                    <TextField
                        required
                        id="outlined-required"
                        label="Twitch user name"
                        defaultValue={this.state.twitchUserName}
                        onChange={this.handleChangeUserName} />
                    <TextField
                        required
                        id="outlined-required"
                        label="Streamlink path"
                        defaultValue={this.state.streamUtilityPath}
                        onChange={this.handleChangeStreamUtilityPath} />
                </Stack>

                <Stack direction="column" alignItems="left" gap={1} style={{ paddingBottom: '10px' }}>
                    <Link to="/oauthTwitch">
                        <Button variant="contained">
                            Authenticate to Twitch
                        </Button>
                    </Link>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Link to="/" onClick={this.saveChanges}>
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
        )
    }
}
