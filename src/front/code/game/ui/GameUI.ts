import { Container, Sprite } from "pixi.js";
import { GameInstance, IVector } from "../../engine/core/GameInstance";
import { clamp, getVectorLength, normalizeVector } from "../../engine/math/math";
import { UIScene } from "../../engine/ui/UIScene";

export class GameUI extends UIScene
{
    joystick: JoystickContainer = new JoystickContainer();
    constructor()
    {
        super();

        this.addChild(this.joystick);
    }
}

export class JoystickContainer extends Container
{
    joystickBG: Sprite | null = null;
    joystickThumb: Sprite | null = null;
    joystickPressed = false;

    thumbVector: IVector = { x: 0, y: 0 };

    private static Singleton: JoystickContainer;

    constructor()
    {
        super();

        JoystickContainer.Singleton = this;

        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onThumbMove = this.onThumbMove.bind(this);

        const gameInstance = GameInstance.Get();

        if (!gameInstance)
        {
            return;
        }

        this.interactive = true;
        this.interactiveChildren = true;
        this.pivot.set(0, 256);

        this.on('pointerdown', (event) =>
        {
            this.joystickPressed = true;
            if (this.joystickBG)
            {
                this.joystickBG.alpha = 1;
            }
            this.onThumbMove(event.data.global);
        });

        this.on('pointerup', this.onTouchEnd);

        window.addEventListener('touchend', this.onTouchEnd)

        window.addEventListener('mouseup', this.onTouchEnd);

        this.on('pointermove', (event) =>
        {
            if (!this.joystickPressed)
            {
                return;
            }

            this.onThumbMove(event.data.global);
        });

        const joystckBgTexture = gameInstance.getTextureInSpriteSheet('virtual_joystick', 'joystick_bg');

        if (joystckBgTexture)
        {
            this.joystickBG = Sprite.from(joystckBgTexture);
            this.addChild(this.joystickBG);
            this.joystickBG.alpha = 0.5;
        }

        const joystickThubmTexture = gameInstance.getTextureInSpriteSheet('virtual_joystick', 'joystick_thumb');

        if (joystickThubmTexture && this.joystickBG)
        {
            this.joystickThumb = Sprite.from(joystickThubmTexture);
            this.joystickBG.addChild(this.joystickThumb);
            this.joystickThumb.anchor.set(0.5);
        }

        this.position = {x: 0, y: gameInstance.getHeight()};

        this.position.x += gameInstance.getWidth() * 0.125;
        this.position.y -= gameInstance.getHeight() * 0.15;

        const maxWidth = 800.0;
        
        const joystickScale = clamp(gameInstance.getWidth() /  maxWidth, 0.25, 1.0);

        this.scale.set(joystickScale);

        this.setThumbAtCenter();
    }

    setThumbAtCenter()
    {
        if (!this.joystickThumb || !this.joystickBG)
        {
            return;
        }

        const center = { x: this.joystickBG.width / 2, y: this.joystickBG.height / 2 };

        this.joystickThumb.position = center;

        this.thumbVector = { x: 0, y: 0 };
    }

    onTouchEnd()
    {
        this.joystickPressed = false;
        this.setThumbAtCenter();

        if (this.joystickBG)
        {
            this.joystickBG.alpha = 0.5;
        }
    }

    onThumbMove(screenPosition: IVector): void
    {
        if (!this.joystickThumb || !this.joystickBG)
        {
            return;
        }

        const backgroundSize = { x: this.joystickBG.width, y: this.joystickBG.height };
        const backgroundSizeScaled = { x: backgroundSize.x * this.scale.x, y: backgroundSize.y * this.scale.y };

        const joystickCenterScreenSpace = this.getGlobalPosition();

        joystickCenterScreenSpace.x += backgroundSizeScaled.x / 2;
        joystickCenterScreenSpace.y -= backgroundSizeScaled.y / 2;

        const locationDiff = { x: screenPosition.x - joystickCenterScreenSpace.x, y: screenPosition.y - joystickCenterScreenSpace.y };

        const vectorLength = clamp(getVectorLength(locationDiff), 0.0, backgroundSize.x / 2);
        const normalizedDiff = normalizeVector(locationDiff);

        const thumbPosition = { x: normalizedDiff.x * vectorLength, y: normalizedDiff.y * vectorLength };

        this.thumbVector = { x: thumbPosition.x / (backgroundSize.x / 2), y: thumbPosition.y / (backgroundSize.y / 2) };

        thumbPosition.x += backgroundSize.x / 2;
        thumbPosition.y += backgroundSize.y / 2;

        this.joystickThumb.position = thumbPosition;

    }

    static getThumbVector(): IVector
    {
        return JoystickContainer.Singleton.thumbVector;
    }
}