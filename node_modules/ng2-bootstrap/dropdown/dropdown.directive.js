import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { isBs3 } from '../utils/ng2-bootstrap-config';
import { DropdownService } from './dropdown.service';
import { DropdownConfig } from './dropdown.config';
/**
 * Mark dropdown content with this directive
 */
export var DropdownDirective = (function () {
    function DropdownDirective(el, ref, dropdownService, config) {
        /** fired when dropdown toggles, $event:boolean equals dropdown isOpen state */
        this.onToggle = new EventEmitter(false);
        /** fired when isOpen value changes */
        this.isOpenChange = new EventEmitter(false);
        this.addClass = true;
        this._isOpen = false;
        // @Query('dropdownMenu', {descendants: false})
        // dropdownMenuList:QueryList<ElementRef>) {
        this.el = el;
        this._changeDetector = ref;
        this.dropdownService = dropdownService;
        Object.assign(this, config);
        // todo: bind to route change event
    }
    Object.defineProperty(DropdownDirective.prototype, "isOpen", {
        /** if `true` dropdown will be opened */
        get: function () {
            return this._isOpen;
        },
        set: function (value) {
            if (this._isOpen === !!value) {
                // don't emit events
                return;
            }
            this._isOpen = !!value;
            // todo: implement after porting position
            // if (this.appendToBody && this.menuEl) {
            //
            // }
            // todo: $animate open<->close transitions, as soon as ng2Animate will be
            // ready
            if (this.isOpen) {
                this.focusToggleElement();
                this.dropdownService.open(this);
            }
            else {
                this.dropdownService.close(this);
                this.selectedOption = void 0;
            }
            this.onToggle.emit(this.isOpen);
            this.isOpenChange.emit(this.isOpen);
            this._changeDetector.markForCheck();
            // todo: implement call to setIsOpen if set and function
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropdownDirective.prototype, "isBs3", {
        get: function () {
            return isBs3();
        },
        enumerable: true,
        configurable: true
    });
    DropdownDirective.prototype.ngOnInit = function () {
        if (this.isOpen) {
        }
    };
    DropdownDirective.prototype.ngOnDestroy = function () {
        if (this.appendToBody && this.menuEl) {
            this.menuEl.nativeElement.remove();
        }
    };
    Object.defineProperty(DropdownDirective.prototype, "dropDownMenu", {
        set: function (dropdownMenu) {
            // init drop down menu
            this.menuEl = dropdownMenu.el;
            if (this.appendToBody) {
                window.document.body.appendChild(this.menuEl.nativeElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropdownDirective.prototype, "dropDownToggle", {
        set: function (dropdownToggle) {
            // init toggle element
            this.toggleEl = dropdownToggle.el;
        },
        enumerable: true,
        configurable: true
    });
    DropdownDirective.prototype.show = function () {
        /** prevent global event handling */
        this.dropdownService.preventEventHandling();
        this.isOpen = true;
    };
    DropdownDirective.prototype.hide = function () {
        /** prevent global event handling */
        this.dropdownService.preventEventHandling();
        this.isOpen = false;
    };
    DropdownDirective.prototype.toggle = function (open) {
        return this.isOpen = arguments.length ? !!open : !this.isOpen;
    };
    DropdownDirective.prototype.focusDropdownEntry = function (keyCode) {
        // If append to body is used.
        var hostEl = this.menuEl ?
            this.menuEl.nativeElement :
            this.el.nativeElement.getElementsByTagName('ul')[0];
        if (!hostEl) {
            // todo: throw exception?
            return;
        }
        var elems = hostEl.getElementsByTagName('a');
        if (!elems || !elems.length) {
            // todo: throw exception?
            return;
        }
        // todo: use parseInt to detect isNumber?
        // todo: or implement selectedOption as a get\set pair with parseInt on set
        switch (keyCode) {
            case (40):
                if (typeof this.selectedOption !== 'number') {
                    this.selectedOption = 0;
                    break;
                }
                if (this.selectedOption === elems.length - 1) {
                    break;
                }
                this.selectedOption++;
                break;
            case (38):
                if (typeof this.selectedOption !== 'number') {
                    return;
                }
                if (this.selectedOption === 0) {
                    // todo: return?
                    break;
                }
                this.selectedOption--;
                break;
            default:
                break;
        }
        elems[this.selectedOption].focus();
    };
    DropdownDirective.prototype.focusToggleElement = function () {
        if (this.toggleEl) {
            this.toggleEl.nativeElement.focus();
        }
    };
    DropdownDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[dropdown]',
                    exportAs: 'bs-dropdown',
                    //tslint:disable-next-line
                    host: { '[class.show]': 'isOpen && !isBs3' }
                },] },
    ];
    /** @nocollapse */
    DropdownDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
        { type: DropdownService, },
        { type: DropdownConfig, },
    ]; };
    DropdownDirective.propDecorators = {
        'isOpen': [{ type: HostBinding, args: ['class.open',] }, { type: HostBinding, args: ['class.active',] }, { type: Input },],
        'autoClose': [{ type: Input },],
        'keyboardNav': [{ type: Input },],
        'appendToBody': [{ type: Input },],
        'onToggle': [{ type: Output },],
        'isOpenChange': [{ type: Output },],
        'addClass': [{ type: HostBinding, args: ['class.dropdown',] },],
    };
    return DropdownDirective;
}());
//# sourceMappingURL=dropdown.directive.js.map