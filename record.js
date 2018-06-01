/**
 * Modified from @clipisode/puppeteer-recorder:
 * https://github.com/clipisode/puppeteer-recorder
 */

function pad(n, width, z = '0') {
    n = n + '';

    if (n.length < width) {
        return new Array(width - n.length + 1).join(z) + n;
    }
    else {
        return n
    }
}

module.exports.record = async function (page, fps = 60, frames = 60) {
    for (let i = 1; i <= fps; i++) {
        console.log(`Rendering frame ${i} of ${frames}`)

        const index = pad(i, 3)

        await page.screenshot({
            path: `output/img-${index}.jpg`,
            type: 'jpeg'
        })
    }
}