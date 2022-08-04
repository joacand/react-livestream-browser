import { Config } from '_/core/Config';
import * as React from 'react';

const config: Config = window.ipcAPI.api.getConfig();

export class OAuthTwitch extends React.Component {
    readonly baseUrl = 'https://id.twitch.tv/';

    componentDidMount(): void {
        const clientId: string = config.twitchClientId;
        window.location.href = this.getOAuthUrl(clientId);
    }

    getOAuthUrl(clientId: string): string {
        return `${this.baseUrl}oauth2/authorize?client_id=${clientId}&redirect_uri=http://localhost&response_type=token+id_token&scope=user:read:follows chat:read chat:edit openid`;
    }

    render(): React.ReactNode {
        return (
            <div style={{ width: 'auto', height: '100%' }}>
                Authentication
            </div>
        )
    }
}
