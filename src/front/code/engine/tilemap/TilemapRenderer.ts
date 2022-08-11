import * as PIXI from 'pixi.js';
import fragmentShader from '../../../shaders/tilemap/tilemap.frag';
import vertexShader from '../../../shaders/tilemap/tilemap.vert';
import { TilemapContainer } from './TilemapContainer';

export class TilemapRenderer extends PIXI.ObjectRenderer
{
    shader: PIXI.Shader;

    constructor(renderer: PIXI.Renderer)
    {
        super(renderer);

        const newFragmentShader = createFragmentShader(fragmentShader, 16);
        this.shader = PIXI.Shader.from(vertexShader, newFragmentShader, { uSamplers: [] });

    }

    render(container: TilemapContainer): any
    {
        if (!container.geometry)
        {
            container.updateGeometry();
        }

        if (!container.geometry)
        {
            return;
        }

        const renderer = this.renderer;
        const shader = this.shader;
        
        const samplersArray = new Array(16);

        for (let i = 0; i < samplersArray.length; i++)
        {
            samplersArray[i] = i;
        }

        shader.uniforms.uSamplers = samplersArray;

        for (let i = 0; i < container.geometry.baseTextures.length; i++)
        {
            renderer.texture.bind(container.geometry.baseTextures[i], i);
        }

        const containerMatrix = container.worldTransform.clone();
        containerMatrix.prepend(renderer.globalUniforms.uniforms.projectionMatrix);

        shader.uniforms['translationMatrix'] = containerMatrix.toArray(true);

        renderer.shader.bind(shader);
        renderer.geometry.bind(container.geometry);

        renderer.geometry.draw(renderer.gl.TRIANGLES, container.geometry.indicesBuffer.length, 0);
    }

    destroy(): void
    {
        super.destroy();
        this.shader.destroy();

    }
}

export function createFragmentShader(baseShader: string, texturesNum: number): string
{
    let shader = baseShader;
    let forloop = "";
    for (let i = 0; i < texturesNum; i++)
    {
        let str = `${i == 0 ? 'if' : 'else if'}(vTextureId == ${(i).toFixed(1)}) {\n`;
        str += `\tcolor = texture2D(uSamplers[${i}], vTextureCoord); \n}\n`
        forloop += str;
    }

    forloop += 'else {\n\tcolor = vec4(0.0, 0.0, 0.0, 1.0);\n}';

    shader = shader.replace("%forloop%", forloop);
    shader = shader.replace("%count%", `${texturesNum}`);
    return shader;
}