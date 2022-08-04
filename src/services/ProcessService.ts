import configurationFile from '../assets/livestream-browser.txt';
import { Config } from '../core/Config';

export class ProcessService {
    readonly getConfig: () => Config;

    readonly highQuality: string = '1080p60,900p60,720p60,best,1080p30,900p,720p30,540p30,480p30,360p30,240p30,160p30';
    readonly mediumQuality: string = 'medium,480p30,480p,540p30,540p,worst';
    readonly lowQuality: string = 'low,360p30,360p,240p30,240p,160p30,160p,worst';

    constructor(getConfig: () => Config) {
        this.getConfig = getConfig;
    }

    openStream(channel: string, quality: number): void {
        const config = this.getConfig();
        const qualityArgument = this.getQualityArgument(quality);

        window.ipcAPI.api.send('openProcess', `"${config.streamUtilityPath}" ${channel} ${qualityArgument} --config "${configurationFile}"`);
    }

    getQualityArgument(quality: number): string {
        switch (quality) {
            case 1: {
                return this.highQuality;
            }
            case 2: {
                return this.mediumQuality;
            }
            default: {
                return this.lowQuality;
            }
        }
    }
}
