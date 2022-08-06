import { Container, DisplayObject } from "pixi.js";
import { Actor } from "../Actor";
import { Component } from "./Component";

export class ContainerComponent extends Component
{
    private container: Container;
    constructor(actor: Actor)
    {
        super(actor);

        this.container = new Container();
    }

    getContainer()
    {
        return this.container;
    }
}