import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { MetaConfig } from './models/meta-config';
export declare class MetaService {
    private router;
    private document;
    private titleService;
    private activatedRoute;
    private metaConfig;
    constructor(router: Router, document: any, titleService: Title, activatedRoute: ActivatedRoute, metaConfig: MetaConfig);
    private _findLastChild(activatedRoute);
    private _getOrCreateMetaTag(name);
    private _updateMetaTags(meta?);
    setTitle(title?: string, titleSuffix?: string): MetaService;
    setTag(tag: string, value: string): MetaService;
}
