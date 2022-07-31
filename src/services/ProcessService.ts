
import configurationFile from "../assets/livestream-browser.rc"
import { Config } from '../core/Config'

export class ProcessService {
    readonly getConfig: () => Config;

    constructor(getConfig: () => Config) {
        this.getConfig = getConfig;
    }

    openStream(channel: string): void {
        const config = this.getConfig();
        window.api.send("openProcess", '"' + config.streamUtilityPath + '" ' + channel +
            ' 1080p60,900p60,720p60,best,1080p30,900p,720p30,540p30,480p30,360p30,240p30,160p30 --config "' + configurationFile + '"');
    }
}
