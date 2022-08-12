import * as PIXI from 'pixi.js';
import { TilemapContainer } from '../../../tilemap/TilemapContainer';
import { Actor } from '../Actor';
import { Component } from './Component';

export class TilemapComponent extends Component
{
    container: TilemapContainer;
    constructor(actor: Actor)
    {
        super(actor);

        this.container = new TilemapContainer();
    }

    getContainer(): PIXI.Container
    {
        return this.container;
    }
}