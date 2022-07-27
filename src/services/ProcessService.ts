
import configurationFile from "../assets/livestream-browser.rc"
import { Config } from '../core/Config'

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            getConfig: () => Config;
        }
    }
}

const config = window.api.getConfig();

export function openStream(channel: string): void {
    window.api.send("openProcess", '"' + config.streamUtilityPath + '" https://www.twitch.tv/' + channel +
        ' 1080p60,900p60,720p60,best,1080p30,900p,720p30,540p30,480p30,360p30,240p30,160p30 --config "' + configurationFile + '"');
}
