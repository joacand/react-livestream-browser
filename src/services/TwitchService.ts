
import { Config } from '../core/Config'

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            getConfig: () => Config;
        }
    }
}

export class TwitchService {

    readonly config = window.api.getConfig();

    readonly baseUrl = "https://api.twitch.tv/";

    async getLiveChannels(): Promise<LiveChannel[]> {

        console.log("Fetching live channels from: " + this.baseUrl);

        const url = this.baseUrl + `helix/streams/followed?stream_type=live&user_id=${this.config.twitchUserId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': `${this.config.twitchClientId}`,
                'Authorization': `Bearer ${this.config.twitchAccessToken}`
            }
        });

        const result = await response.json() as TwitchStreamsRootResponse;
        return result.data.map((x: Stream) => {
            return <LiveChannel>{
                name: x.user_name,
                title: x.title,
                game: x.game_name,
                viewers: x.viewer_count,
                runTime: x.started_at,
                bitmapUrl: x.thumbnail_url.replace("{width}", "848").replace("{height}", "480"),
                url: `https://www.twitch.tv/${x.user_name}`,
                channelId: x.user_id
            };
        });
    }
}

export interface LiveChannel {
    name: string
    title: string
    game: string
    viewers: string
    runTime: string
    bitmapUrl: string
    url: string
    channelId: string
}

interface TwitchStreamsRootResponse {
    data: Stream[]
}

interface Stream {
    id: string
    user_id: string
    user_login: string
    user_name: string
    game_id: string
    game_name: string
    type: string
    title: string
    viewer_count: string
    started_at: string
    language: string
    thumbnail_url: string
}