import { DropdownDirective } from './dropdown.directive';
export declare const ALWAYS: string;
export declare const DISABLED: string;
export declare const OUTSIDECLICK: string;
export declare const NONINPUT: string;
export declare class DropdownService {
    private openScope;
    private closeDropdownBind;
    private keybindFilterBind;
    private suspendedEvent;
    open(dropdownScope: DropdownDirective): void;
    close(dropdownScope: DropdownDirective): void;
    preventEventHandling(): void;
    protected closeDropdown(event: MouseEvent): void;
    protected keybindFilter(event: KeyboardEvent): void;
}
