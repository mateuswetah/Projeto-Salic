import { Directive, ElementRef, Host, HostBinding } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
export var DropdownMenuDirective = (function () {
    /* tslint:enable:no-unused-variable */
    function DropdownMenuDirective(dropdown, el) {
        /* tslint:disable:no-unused-variable */
        this.addClass = true;
        this.dropdown = dropdown;
        this.el = el;
    }
    DropdownMenuDirective.prototype.ngOnInit = function () {
        this.dropdown.dropDownMenu = this;
    };
    DropdownMenuDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[dropdownMenu]',
                    exportAs: 'bs-dropdown-menu'
                },] },
    ];
    /** @nocollapse */
    DropdownMenuDirective.ctorParameters = function () { return [
        { type: DropdownDirective, decorators: [{ type: Host },] },
        { type: ElementRef, },
    ]; };
    DropdownMenuDirective.propDecorators = {
        'addClass': [{ type: HostBinding, args: ['class.dropdown-menu',] },],
    };
    return DropdownMenuDirective;
}());
//# sourceMappingURL=dropdown-menu.directive.js.map