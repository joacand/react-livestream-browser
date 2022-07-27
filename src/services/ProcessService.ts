
import configurationFile from "../assets/livestream-browser.rc"
import { Config } from '../core/Config'

export class ProcessService {
    readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    openStream(channel: string): void {
        window.api.send("openProcess", '"' + this.config.streamUtilityPath + '" https://www.twitch.tv/' + channel +
            ' 1080p60,900p60,720p60,best,1080p30,900p,720p30,540p30,480p30,360p30,240p30,160p30 --config "' + configurationFile + '"');
    }
}
