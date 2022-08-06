import { Actor } from "../Actor";
import { DisplayObject, Container } from 'pixi.js';
import { IVector } from "../../../core/GameInstance";

export class Component
{
    private actor: Actor;
    private children: Array<Component> = [];
    private parent: Component | null = null;

    constructor(actor: Actor)
    {
        this.actor = actor;
    }

    /**
     * @param deltaTime in ms
     */
    tick(deltaTime: number): void
    {
        for (const child of this.children)
        {
            child.tick(deltaTime);
        }

        return;
    }

    addChild(component: Component): void
    {
        component.actor = this.actor;
        component.parent = this;
        this.children.push(component);

        component.addDisplayObject();
    }

    getContainer(): Container | null
    {
        return null;
    }

    addDisplayObject(): void
    {
        const container = this.getContainer();

        if (!container)
        {
            return;
        }

        if (this.actor && this.actor.getRootComponent() == this)
        {
            this.actor.getContainer().addChild(container);

            return;
        }

        if (this.parent)
        {
            const parentContainer = this.parent.getContainer();

            if (parentContainer)
            {
                parentContainer.addChild(container);
            }
        }
    }

    onClicked(event: any): void
    {
        if (this.actor)
        {
            this.actor.onClicked(this);
        }
    }

    private _location: IVector = { x: 0, y: 0 };

    public set location(loc: IVector)
    {
        if (this.actor && !this.parent && this.actor.getRootComponent() == this)
        {
            this.actor.location = loc;
            return;
        }

        this._location.x = loc.x;
        this._location.y = loc.y;

        const container = this.getContainer();

        if (container)
        {
            container.position = this._location;
        }
    }

    public get location()
    {
        return this._location;
    }
}