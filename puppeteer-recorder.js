/**
 * Modified from @clipisode/puppeteer-recorder:
 * https://github.com/clipisode/puppeteer-recorder
 */

const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

function pad(n, width, z = '0') {
    n = n + '';

    if (n.length < width) {
        return new Array(width - n.length + 1).join(z) + n;
    }
    else {
        return n
    }
}

module.exports.record = async function (options) {
    const browser = options.browser || (await puppeteer.launch());
    const page = options.page || (await browser.newPage());

    await options.prepare(browser, page);

    var ffmpegPath = options.ffmpeg || 'ffmpeg';
    var fps = options.fps || 60;

    var outFile = options.output;

    const args = ffmpegArgs(fps);

    if ('format' in options) args.push(options.format);
    else if (!outFile) args.push('matroska');

    args.push(outFile || '-');

    const ffmpeg = spawn(ffmpegPath, args);

    if (options.pipeOutput) {
        ffmpeg.stdout.pipe(process.stdout);
        ffmpeg.stderr.pipe(process.stderr);
    }

    const closed = new Promise((resolve, reject) => {
        ffmpeg.on('error', reject);
        ffmpeg.on('close', resolve);
    });

    for (let i = 1; i <= options.frames; i++) {
        if (options.logEachFrame) {
            console.log(
                `[puppeteer-recorder] rendering frame ${i} of ${options.frames}.`
            );
        }

        await options.render(browser, page, i);

        let screenshot = await page.screenshot({ type: 'jpeg' });

        await write(ffmpeg.stdin, screenshot);
    }

    ffmpeg.stdin.end();

    await closed;
};

const ffmpegArgs = fps => [
    '-f', 'image2pipe',
    '-r', `${+fps}`,
    '-i', '-',
    '-c:v', 'libvpx',
    '-pix_fmt', 'yuv420p'
];

const write = (stream, buffer) => {
    new Promise((resolve, reject) => {
        stream.write(buffer, error => {
            if (error) reject(error);
            else resolve();
        });
    });
}