import { NONINPUT } from './dropdown.service';
import { Injectable } from '@angular/core';
/** Default dropdown configuration */
export var DropdownConfig = (function () {
    function DropdownConfig() {
        /** default dropdown auto closing behavior */
        this.autoClose = NONINPUT;
        /** is keyboard navigation enabled by default */
        this.keyboardNav = false;
    }
    DropdownConfig.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DropdownConfig.ctorParameters = function () { return []; };
    return DropdownConfig;
}());
//# sourceMappingURL=dropdown.config.js.map