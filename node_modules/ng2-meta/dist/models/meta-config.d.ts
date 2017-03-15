export interface MetaConfig {
    useTitleSuffix?: boolean;
    defaults?: {
        title?: string;
        titleSuffix?: string;
        [key: string]: string;
    };
}
