import { filters, Text, TextStyle, Texture } from "pixi.js";
import { GameInstance } from "../../engine/core/GameInstance";
import { Actor } from "../../engine/scene/actors/Actor";
import { SpriteComponent } from "../../engine/scene/actors/components/SpriteComponent";
import { DropShadowFilter } from "pixi-filters";
import { ContainerComponent } from "../../engine/scene/actors/components/ContainerComponent";
import { getTelegramWebApp } from "../../engine/thirdParty/telegram/telegram";

export class Pawn extends Actor
{
    spriteComponent: SpriteComponent | null = null;
    textComponent: Text | null = null;
    pawnTexture: Texture | null = null;
    flippedTexture: Texture | null = null;
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

        const root = new ContainerComponent(this);

        this.setRootComponent(root);

        root.getContainer().sortableChildren = true;

        this.pawnTexture = gameInstance.getTextureByName('t_pawn');

        if (!this.pawnTexture)
        {
            return;
        }

        this.flippedTexture = new Texture(this.pawnTexture.baseTexture, this.pawnTexture.frame, this.pawnTexture.orig, this.pawnTexture.trim, 12);

        this.spriteComponent = new SpriteComponent(this, this.pawnTexture);
        this.spriteComponent.getSprite().zIndex = 1;
        this.spriteComponent.getSprite().scale.set(120 / 16);
        root.addChild(this.spriteComponent);

        const shadow = new SpriteComponent(this, gameInstance.getTextureByName('t_shadow'));
        shadow.getSprite().zIndex = 0;
        shadow.getSprite().anchor.set(0.5, 0.5);
        shadow.getSprite().alpha = 0.3;
        shadow.getSprite().scale.set(3.5);
        root.addChild(shadow);

        this.getContainer().zIndex = 10;

        this.spriteComponent.getSprite().anchor.set(0.5, 1);

        const textStyle = new TextStyle({
            align: 'center',
            fontFamily: 'Arial',
            fontSize: 30,
            fill: '#ffffff',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
        });

        this.textComponent = new Text('', textStyle);

        this.textComponent.anchor.set(0.5);

        root.getContainer().addChild(this.textComponent);
        this.textComponent.position.y = 80.0;



        const nameComponent = new Text('', textStyle);

        nameComponent.anchor.set(0.5);

        root.getContainer().addChild(nameComponent);
        nameComponent.position.y = -270.0;

        const telegramApp = getTelegramWebApp();

        if (telegramApp && telegramApp.initDataUnsafe && telegramApp.initDataUnsafe.user)
        {
            nameComponent.text = telegramApp.initDataUnsafe.user.first_name || '';
        }

        this.updateSpriteFlipStatus(false);
    }

    tick(deltaTime: number): void
    {
        const oldVelocity = this.velocity;

        if (oldVelocity.x > 0)
        {
            this.updateSpriteFlipStatus(false);
        }
        else if (oldVelocity.x < 0)
        {
            this.updateSpriteFlipStatus(true);
        }

        super.tick(deltaTime);
        
        const gameInstance = GameInstance.Get();
        if (this.textComponent && gameInstance)
        {
            const location = {...this.location};
            const tileSize = 128;
            location.x = Math.floor(location.x / tileSize);
            location.y = Math.floor(location.y / tileSize);
            this.textComponent.text = `${gameInstance.getApp().ticker.FPS.toFixed(0)} FPS\nX: ${location.x}, Y: ${location.y}`;
        }
    }

    updateSpriteFlipStatus(bFlipped: boolean): void
    {
        const texture = bFlipped ? this.flippedTexture : this.pawnTexture;

        if (!texture)
        {
            return;
        }

        if (this.spriteComponent)
        {
            this.spriteComponent.getSprite().texture = texture;
        }
    }

}