import { Injectable } from '@angular/core';
export var ALWAYS = 'always';
export var DISABLED = 'disabled';
export var OUTSIDECLICK = 'outsideClick';
export var NONINPUT = 'nonInput';
/* tslint:disable-next-line */
var KeyboardEvent = global.KeyboardEvent;
/* tslint:disable-next-line */
var MouseEvent = global.MouseEvent;
export var DropdownService = (function () {
    function DropdownService() {
        this.closeDropdownBind = this.closeDropdown.bind(this);
        this.keybindFilterBind = this.keybindFilter.bind(this);
    }
    DropdownService.prototype.open = function (dropdownScope) {
        if (!this.openScope) {
            window.document.addEventListener('click', this.closeDropdownBind, true);
            window.document.addEventListener('keydown', this.keybindFilterBind);
        }
        if (this.openScope && this.openScope !== dropdownScope) {
            this.openScope.isOpen = false;
        }
        this.openScope = dropdownScope;
    };
    DropdownService.prototype.close = function (dropdownScope) {
        if (this.openScope !== dropdownScope) {
            return;
        }
        this.openScope = void 0;
        window.document.removeEventListener('click', this.closeDropdownBind, true);
        window.document.removeEventListener('keydown', this.keybindFilterBind);
    };
    DropdownService.prototype.preventEventHandling = function () {
        clearTimeout(this.suspendedEvent);
    };
    DropdownService.prototype.closeDropdown = function (event) {
        var _this = this;
        this.suspendedEvent = setTimeout(function () {
            if (!_this.openScope) {
                return;
            }
            if (event && _this.openScope.autoClose === DISABLED) {
                return;
            }
            if (event && _this.openScope.toggleEl &&
                _this.openScope.toggleEl.nativeElement.contains(event.target)) {
                return;
            }
            if (event && _this.openScope.autoClose === NONINPUT &&
                _this.openScope.menuEl &&
                /input|textarea/i.test(event.target.tagName) &&
                _this.openScope.menuEl.nativeElement.contains(event.target)) {
                return;
            }
            if (event && _this.openScope.autoClose === OUTSIDECLICK &&
                _this.openScope.menuEl &&
                _this.openScope.menuEl.nativeElement.contains(event.target)) {
                return;
            }
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            _this.openScope.isOpen = false;
        }, 0);
    };
    DropdownService.prototype.keybindFilter = function (event) {
        if (event.which === 27) {
            this.openScope.focusToggleElement();
            this.closeDropdown(void 0);
            return;
        }
        if (this.openScope.keyboardNav && this.openScope.isOpen &&
            (event.which === 38 || event.which === 40)) {
            event.preventDefault();
            event.stopPropagation();
            this.openScope.focusDropdownEntry(event.which);
        }
    };
    DropdownService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DropdownService.ctorParameters = function () { return []; };
    return DropdownService;
}());
//# sourceMappingURL=dropdown.service.js.map