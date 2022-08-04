import { Config } from '../core/Config';
import { LiveChannel } from '../core/LiveChannel';

export class TwitchService {
    readonly getConfig: () => Config;

    constructor(getConfig: () => Config) {
        this.getConfig = getConfig;
    }

    readonly baseUrl = 'https://api.twitch.tv/';

    async getLiveChannels(): Promise<LiveChannel[]> {
        const config = this.getConfig();

        console.log(`Fetching live channels from: ${this.baseUrl}`);

        const url = `${this.baseUrl}helix/streams/followed?stream_type=live&user_id=${config.twitchUserId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.twitchtv.v5+json',
                'Client-ID': `${config.twitchClientId}`,
                Authorization: `Bearer ${config.twitchAccessToken}`,
            }
        });

        const result = await response.json() as TwitchStreamsRootResponse;
        return result.data.map((x: Stream) => <LiveChannel>{
            name: x.user_name,
            title: x.title,
            game: x.game_name,
            viewers: x.viewer_count,
            runTime: x.started_at,
            bitmapUrl: x.thumbnail_url.replace('{width}', '848').replace('{height}', '480'),
            url: `https://www.twitch.tv/${x.user_name}`,
            channelId: x.user_id
        });
    }
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
