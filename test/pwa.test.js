const klawSync = require('klaw-sync')
const path = require('path')
const fs = require('fs-extra')
const { Nuxt, Builder } = require('nuxt-edge')

const getRelativePath = fileObj => path.relative(__dirname, fileObj.path)

const noJS = item => !/\.js/.test(item)

jest.mock('hasha', () => {
  const originalHasha = jest.requireActual('hasha')
  const hasha = jest.fn(() => 'HASHMOCK')
  hasha.fromFile = originalHasha.fromFile
  return hasha
})

describe('pwa', () => {
  let nuxt

  test('build project', async () => {
    nuxt = new Nuxt(require('./fixture/nuxt.config'))
    await nuxt.ready()

    // Generate before running tests as a known issue
    // Build for more coverage
    const builder = new Builder(nuxt)
    await builder.build()
    // const generator = new Generator(nuxt)
    // await generator.generate({ build: false })
  }, 60000)

  test('build files (.nuxt)', async () => {
    const buildFiles = klawSync(nuxt.options.buildDir).map(getRelativePath)

    expect(buildFiles.filter(noJS)).toMatchSnapshot()
  })

  test('generate files (dist)', async () => {
    const generateFiles = klawSync(nuxt.options.generate.dir).map(getRelativePath)

    expect(generateFiles.filter(noJS)).toMatchSnapshot()
  })

  test('accessible icons', async () => {
    const { html } = await nuxt.renderRoute('/')
    expect(html).toContain('/_nuxt/icons/icon_512.b8f3a1.png')
  })

  test('sw.js', async () => {
    const swContents = await fs.readFile(path.resolve(nuxt.options.generate.dir, 'sw.js'), 'utf-8')

    expect(swContents.replace(/@[^/]*/, '')).toMatchSnapshot()
  })
})
