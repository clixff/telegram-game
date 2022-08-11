import _http from 'http';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotReloadMiddleware from 'webpack-hot-middleware';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';


const NODE_ENV: string|undefined = process.env.NODE_ENV === 'development' ? 'development' : 'production';

const app = express();
const http = _http.createServer(app);

const appPath: string = path.join(process.cwd());

const port = 8496;


if (NODE_ENV === 'production')
{
    app.get('/', (req, res) =>
    {
        const htmlPath = path.join(appPath, 'dist', 'index.html');
        res.sendFile(htmlPath);
    });
    
    app.use('/', express.static(appPath + '/dist/'));
}
else
{
    const compiler = webpack({
        mode: 'development',
        entry: [ 'webpack-hot-middleware/client', path.join(appPath, 'src', 'front', 'index.ts')],
        output: {
            path: path.join(appPath, 'dist'),
            filename: 'index.js'
        },
        module: 
        {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        }
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: ["style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        }
                    }]
                },
                {
                    test: /\.m?js$/,
                    enforce: 'pre',
                    use: ['source-map-loader']
                },
                {
                    test: /\.(vert|frag)$/i,
                    type: 'asset/source'
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
              template: "./src/front/index.html"
            }),
            new webpack.HotModuleReplacementPlugin(),
            new CopyWebpackPlugin(
                {
                    patterns: [
                        {
                            from: './src/front/assets',
                            to: 'assets'
                        }
                    ]
                }    
            ),
        ],
        resolve: {
            extensions: [ '.ts', '.js' ],
        },
    });

    app.use(devMiddleware(compiler, {
        /**
         * webpack dev middleware options
         */
        // contentBase: path.join(appPath, 'dist'),
        // compress: true,
        // port: 9000
    
    }));
    
    app.use(hotReloadMiddleware(compiler));
}

http.listen(port, '0.0.0.0', () =>
{
});