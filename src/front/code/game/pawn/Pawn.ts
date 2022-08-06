import { Text, TextStyle } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { Actor } from "../../engine/scene/actors/Actor";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";

export class Pawn extends Actor
{
    spriteComponent: SpriteComponent | null = null;
    textComponent: Text | null = null;
    constructor()
    {
        super();

        this.acceleration = 150.0;
        this.deceleration = 1;
        this.speedMultiplier = 3.0;

        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }

        this.spriteComponent = new SpriteComponent(this, gameInstance.getTextureByName('t_pawn'));
        this.setRootComponent(this.spriteComponent);

        this.getContainer().zIndex = 10;

        this.spriteComponent.getSprite().anchor.set(0.5, 1);


        this.textComponent = new Text('', new TextStyle({
            align: 'center',
            fontFamily: 'Arial',
            fontSize: 30,
            fill: '#ffffff',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,

        }));

        this.textComponent.anchor.set(0.5);

        this.spriteComponent.getSprite().addChild(this.textComponent);
        this.textComponent.position.y = 50.0;
    }

    tick(deltaTime: number): void
    {
        super.tick(deltaTime);
        
        const gameInstance = GameInstance.Get();
        if (this.textComponent && gameInstance)
        {
            this.textComponent.text = `${gameInstance.getApp().ticker.FPS.toFixed(0)} FPS`;
        }

    }
}