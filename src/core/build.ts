import fs, { promises as fsPromises } from 'fs';
import path from 'path';


const appPath: string = path.join(process.cwd());

const foldersToSymlink = ['assets', 'styles', 'shaders'];

foldersToSymlink.forEach((folder) =>
{
    try
    {
        const dir1 = path.join(appPath, 'src', 'front', folder);
        const dir2 = path.join(appPath, 'build', 'front', folder);
        console.log(`Create symlink from ${dir1} to ${dir2}`);
        fs.symlinkSync(dir1, dir2, 'dir');
    }
    catch (error)
    {
        /**
         * 
         */
    }
});