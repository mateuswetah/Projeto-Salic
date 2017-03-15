import { Directive, ElementRef, Host, HostBinding, HostListener, Input } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
/* tslint:disable-next-line */
var MouseEvent = global.MouseEvent;
/** Mark element which can toggle dropdown visibility with this directive */
export var DropdownToggleDirective = (function () {
    function DropdownToggleDirective(dropdown, el) {
        /** if true dropdown toggle will be disabled */
        this.isDisabled = false;
        /** if true the dropdown-toggle class will be added to the element */
        this.addToggleClass = true;
        this.addClass = true;
        this.dropdown = dropdown;
        this.el = el;
    }
    DropdownToggleDirective.prototype.ngOnInit = function () {
        this.dropdown.dropDownToggle = this;
    };
    Object.defineProperty(DropdownToggleDirective.prototype, "isOpen", {
        get: function () {
            return this.dropdown.isOpen;
        },
        enumerable: true,
        configurable: true
    });
    DropdownToggleDirective.prototype.toggleDropdown = function (event) {
        event.stopPropagation();
        if (!this.isDisabled) {
            this.dropdown.toggle();
        }
        return false;
    };
    DropdownToggleDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[dropdownToggle]',
                    exportAs: 'bs-dropdown-toggle'
                },] },
    ];
    /** @nocollapse */
    DropdownToggleDirective.ctorParameters = function () { return [
        { type: DropdownDirective, decorators: [{ type: Host },] },
        { type: ElementRef, },
    ]; };
    DropdownToggleDirective.propDecorators = {
        'isDisabled': [{ type: HostBinding, args: ['class.disabled',] }, { type: Input },],
        'addToggleClass': [{ type: HostBinding, args: ['class.dropdown-toggle',] }, { type: Input },],
        'addClass': [{ type: HostBinding, args: ['attr.aria-haspopup',] },],
        'isOpen': [{ type: HostBinding, args: ['attr.aria-expanded',] },],
        'toggleDropdown': [{ type: HostListener, args: ['click', ['$event'],] },],
    };
    return DropdownToggleDirective;
}());
//# sourceMappingURL=dropdown-toggle.directive.js.map