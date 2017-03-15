import { MetaSettings } from './models/meta-settings';
export declare abstract class MetaLoader {
    abstract getSettings(): MetaSettings;
}
export declare class MetaStaticLoader implements MetaLoader {
    private readonly settings;
    constructor(settings?: MetaSettings);
    getSettings(): MetaSettings;
}
