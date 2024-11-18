import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function getMobileAPKFile(req: NextApiRequest, res: NextApiResponse) {
    const apkPath: string = path.join('/home/apk', 'app-release.apk');

    if (!fs.existsSync(apkPath)) {
        console.error("APK file not found at", apkPath);
        res.status(404).json({ error: 'APK file not found' });
        return;
    }

    res.setHeader('Content-Disposition', 'attachment; filename=app-release.apk');
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    const fileStream:  fs.ReadStream = fs.createReadStream(apkPath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
        console.error('File streaming error:', err);
        res.status(500).end('Internal Server Error');
    });
}
