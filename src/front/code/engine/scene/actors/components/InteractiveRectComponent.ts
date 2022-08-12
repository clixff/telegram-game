import * as PIXI from 'pixi.js';
import { Actor } from '../Actor';
import { Component } from './Component';

/** Rect that can be clicked and can be rendered */
export class InteractiveRectComponent extends Component
{
    rect: PIXI.Graphics;
    events: Record<string, ((...args: any) => void)[]> = {};
    constructor(actor: Actor)
    {
        super(actor);

        this.rect = new PIXI.Graphics();

        this.rect.interactive = true;

        this.rect.on('pointertap', this.onClick.bind(this));
        this.rect.on('pointerdown', this.onPointerDown.bind(this));
        this.rect.on('pointerup', this.onPointerUp.bind(this));
        this.rect.renderable = false;
    }

    getContainer(): PIXI.Container
    {
        return this.rect;   
    }

    setRect(x: number, y: number, width: number, height: number)
    {
        this.rect.clear();
        this.rect.beginFill(0xFF0000, 0.25);
        this.rect.drawRect(x, y, width, height);
        this.rect.endFill();
    }

    setVisibility(newVisibility: boolean): void
    {
        this.rect.renderable = newVisibility;
    }
    
    onClick(event: any): void
    {
        this.emit('click', event);
    }
    
    onPointerDown(event: any): void
    {
        this.emit('pointerdown', event);
    }

    onPointerUp(event: any): void
    {
        this.emit('pointerup', event);
    }

    on(eventName: string, callback: (...args: any) => void): void
    {
        if (!this.events[eventName])
        {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);
    }

    private emit(eventName: string, ...args: any): void
    {
        const eventsArray = this.events[eventName];
        
        if (!eventsArray)
        {
            return;
        }

        for (const eventCallback of eventsArray)
        {
            eventCallback(...args);
        }
    }
}