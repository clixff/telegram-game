import { Container } from 'pixi.js';
import { GameInstance, IVector } from '../../core/GameInstance';
import { clamp } from '../../math/math';
import { Component } from './components/Component';

/** Has coordinates in world space, components, and can be located in the world.  */
export class Actor
{
    private container: Container;

    private rootComponent: Component | null = null;

    private _velocity = { x: 0, y: 0 };

    acceleration: number = 1.0;
    deceleration: number = 1.0;

    speedMultiplier = 1.0;

    constructor(bTick: boolean = true)
    {
        this.container = new Container();

        if (bTick)
        {
            const gameInstance = GameInstance.Get();
            
            if (gameInstance)
            {
                gameInstance.getApp().ticker.add(() =>
                {
                    this.tick(gameInstance.getApp().ticker.elapsedMS);
                })
            }
        }
    }

    /**
     * @param deltaTime in ms
     */
    tick(deltaTime: number): void
    {
        if (this.rootComponent)
        {
            this.rootComponent.tick(deltaTime);
        }

        /** Move actor with velocity */

        const deltaSec = Number((deltaTime / 1000.0).toFixed(5));

        const velocityTick = { x: (this._velocity.x * deltaSec), y: (this._velocity.y * deltaSec)  };

        velocityTick.x *= this.speedMultiplier;
        velocityTick.y *= this.speedMultiplier;

        this.location = { x: this.location.x + (velocityTick.x * this.acceleration), y: this.location.y + (velocityTick.y * this.acceleration)  };

        this.velocity = { x: this._velocity.x - (velocityTick.x * this.deceleration), y: this._velocity.y - (velocityTick.y * this.deceleration) };

        this._velocity.x = Number(this._velocity.x.toFixed(5));
        this._velocity.y = Number(this._velocity.y.toFixed(5));

        return;
    }

    getContainer(): Container
    {
        return this.container;
    }

    destroy(): void
    {
        const gameInstance = GameInstance.Get();

        if (gameInstance)
        {
            const gameScene = gameInstance.getGameScene();

            if (gameScene)
            {
                gameScene.destroyActor(this);
            }
        }

        this.container.destroy();
    }

    getRootComponent(): Component | null
    {
        return this.rootComponent;
    }

    setRootComponent(component: Component): void
    {
        if (this.rootComponent)
        {
            const oldComponentContainer = this.rootComponent.getContainer();

            if (oldComponentContainer)
            {
                this.container.removeChild(oldComponentContainer);
                oldComponentContainer.destroy();
            }
        }

        this.rootComponent = component;

        const componentContainer = component.getContainer();
        if (componentContainer)
        {
            this.container.addChild(componentContainer);
        }
    }

    onClicked(component: Component): void
    {

    }

    addVelocity(velocity: IVector): void
    {
        this._velocity.x += velocity.x;
        this._velocity.y += velocity.y;

        this.velocity.x = clamp(this.velocity.x, -1, 1);
        this.velocity.y = clamp(this.velocity.y, -1, 1);

        console.log(`New velocity: ${this._velocity.x}, ${this._velocity.y}`);
    }

    private _location: IVector = { x: 0, y: 0 };

    public set location(loc: IVector)
    {
        this._location.x = loc.x;
        this._location.y = loc.y;

        this.getContainer().position = this._location;
    }

    public get location()
    {
        return this._location;
    }

    public set velocity(vel: IVector)
    {
        this._velocity.x = vel.x;
        this._velocity.y = vel.y;
    }

    public get velocity()
    {
        return this._velocity;
    }
}