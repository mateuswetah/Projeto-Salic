import { OpaqueToken, ModuleWithProviders } from '@angular/core';
import { MetaConfig } from './models/meta-config';
export declare const META_CONFIG: OpaqueToken;
export declare class MetaModule {
    static forRoot(metaConfig?: MetaConfig): ModuleWithProviders;
}
