const path = require('path')
const puppeteer = require('puppeteer')
const { record } = require('./record')

const url = 'https://www.jonasluebbers.com'

const fps = 60
const frames = 60

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
        await record(page, fps, frames)
        await browser.close()
    }
    catch (error) {
        browser.close()
    }
}

start()