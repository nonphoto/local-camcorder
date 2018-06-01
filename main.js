const path = require('path')
const puppeteer = require('puppeteer')
const { record } = require('./puppeteer-recorder')

const url = 'https://www.jonasluebbers.com'

const recordOptions = {
    fps: 60,
    frames: 100,
    output: 'output.mp4',
    format: 'mp4',
    logEachFrame: true,
    pipeOutput: true,
    prepare: () => {},
    render: () => {}
}

const puppeteerOptions = {
    args: ['--no-sandbox']
}

const viewportOptions = {
    width: 800,
    height: 600,
    deviceScaleFactor: 1
}

async function start() {
    const browser = await puppeteer.launch(puppeteerOptions)
    const page = await browser.newPage()

    try {
        await page.setViewport(viewportOptions)
        await page.goto(url)
        await record(Object.assign(recordOptions, { browser, page }))
        await browser.close()
    }
    catch (error) {
        browser.close()
    }
}

start()