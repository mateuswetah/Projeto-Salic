import { PageTitlePositioning } from './models/page-title-positioning';
var MetaLoader = (function () {
    function MetaLoader() {
    }
    return MetaLoader;
}());
export { MetaLoader };
var MetaStaticLoader = (function () {
    function MetaStaticLoader(settings) {
        if (settings === void 0) { settings = {
            pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
            defaults: {}
        }; }
        this.settings = settings;
    }
    MetaStaticLoader.prototype.getSettings = function () {
        return this.settings;
    };
    return MetaStaticLoader;
}());
export { MetaStaticLoader };
