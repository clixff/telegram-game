import { Container } from 'pixi.js';
import { IVector } from '../core/GameInstance';
import { Actor } from './actors/Actor';


export class GameScene extends Container
{
    private actors: Array<Actor> = [];
    private worldZoom = 1;
    constructor()
    {
        super();

        this.setSceneOffset(0, 0);

        this.sortableChildren = true;

        this.setWorldZoom(0.35);
    }

    spawnActor<T extends Actor = Actor>(actorClass: { new(bTick: boolean): T }, bTick: boolean = true): T
    {
        const actor = new actorClass(bTick);

        this.actors.push(actor);
        this.addChild(actor.getContainer());

        return actor;
    }

    destroyActor(actor: Actor): void
    {
        if (!actor)
        {
            return;
        }

        this.removeChild(actor.getContainer());

        const index = this.actors.indexOf(actor);
        if (index !== -1)
        {
            this.actors.splice(index, 1);
        }
    }

    setSceneOffset(x: number, y: number): void
    {
        this.position.x = (window.innerWidth / 2) + (x * this.worldZoom);
        this.position.y = (window.innerHeight / 2) + (y * this.worldZoom);

        // console.log(`Set new offset: ${this.position.x}, ${this.position.y}`);
    }

    getSceneOffset(): IVector
    {
        const zeroOffset = {
            x: (window.innerWidth / 2),
            y: (window.innerHeight / 2)
        };

        return {
            x: (this.position.x * this.worldZoom) - zeroOffset.x,
            y: (this.position.y * this.worldZoom) - zeroOffset.y
        };
    }

    setWorldZoom(newZoom: number): void
    {
        this.worldZoom = newZoom;
        this.scale.x = this.scale.y = newZoom;
    }
    
    getWorldZoom(): number
    {
        return this.worldZoom;
    }
}