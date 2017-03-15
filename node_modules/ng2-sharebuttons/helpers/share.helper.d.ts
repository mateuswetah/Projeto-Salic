import { ShareArgs } from './share-buttons.class';
import { ShareProvider } from './share-provider.enum';
export declare module Helper {
    /** Prepare gPlus count request body   */
    const gplusCountBody: (url: any) => {
        method: string;
        id: string;
        params: {
            nolog: boolean;
            id: string;
            source: string;
            userId: string;
            groupId: string;
        };
        jsonrpc: string;
        key: string;
        apiVersion: string;
    }[];
    const shareFactory: (type: ShareProvider, args: ShareArgs) => string;
    const nFormatter: (num: number, digits: number) => string;
    const getEnumValue: <T>(value: string | number, enumeration: T) => number;
}
