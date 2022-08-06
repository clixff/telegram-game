import { Container, DisplayObject, Sprite, Texture } from "pixi.js";
import { Actor } from "../Actor";
import { Component } from "./Component";

export class SpriteComponent extends Component
{
    private sprite: Sprite;
    constructor(actor: Actor, texture: Texture | null)
    {
        super(actor);

        if (!texture)
        {
            this.sprite = new Sprite();
            console.error('[SpriteComponent] Texture is null');
            return;
        }

        this.sprite = Sprite.from(texture);
        this.sprite.anchor.set(0.5);
    }

    getContainer(): Container | null 
    {
        return this.getSprite();    
    }

    getSprite(): Sprite
    {
        return this.sprite;
    }
}