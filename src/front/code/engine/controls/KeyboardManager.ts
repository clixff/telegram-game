type KeyCallback = (code: string, isDown: boolean) => void;

export class KeyboardManager
{
    private static instance: KeyboardManager;

    private keys: Map<string, boolean> = new Map();

    private listeners: Array<KeyCallback> = [];

    constructor()
    {
        KeyboardManager.instance = this;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    static Get(): KeyboardManager
    {
        return this.instance;
    }

    onKeyDown(event: KeyboardEvent): void
    {
        for (const listener of this.listeners)
        {
            listener(event.code, true);
        }

        this.keys.set(event.code, true);
    }

    onKeyUp(event: KeyboardEvent): void
    {
        for (const listener of this.listeners)
        {
            listener(event.code, false);
        }

        this.keys.delete(event.code);
    }

    addListener(callback: KeyCallback)
    {
        this.listeners.push(callback);
    }

    isKeyDown(code: string): boolean
    {
        return this.keys.has(code);
    }
}