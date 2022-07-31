
import * as React from 'react';
import { Config } from '../../core/Config'
import { Button, Stack, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            getConfig: () => Config;
            setConfig: (newConfig: Config) => void;
        }
    }
}

const config = window.api.getConfig();
const saveConfig = window.api.setConfig;

export class OAuthTwitch extends React.Component {

    readonly baseUrl = "https://id.twitch.tv/";

    getOAuthUrl(clientId: string): string {
        return this.baseUrl + `oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost&response_type=token+id_token&scope=user:read:follows chat:read chat:edit openid`;
    }

    constructor(props: any) {
        super(props);
    }

    componentDidMount(): void {
        const clientId = config.twitchClientId;
        window.location.href = this.getOAuthUrl(clientId);
    }

    render(): React.ReactNode {
        return (
            <div style={{ width: 'auto', height: '100%' }}>
                Authentication
            </div>
        )
    }
}
