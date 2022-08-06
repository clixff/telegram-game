import EventEmitter from "events";
import { KeyboardManager } from "../controls/KeyboardManager";

export class PlayerController extends EventEmitter
{
    constructor()
    {
        super();

        const keyManager = KeyboardManager.Get();

        this.onKeyEvent = this.onKeyEvent.bind(this);
        keyManager.addListener(this.onKeyEvent);
    }

    onKeyEvent(code: string, isDown: boolean): void
    {
        // console.log(code, isDown);
    }
}