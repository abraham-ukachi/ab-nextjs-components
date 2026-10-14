/* 
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~ 
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions: 
*  
* The above copyright notice and this permission notice shall be included in all 
* copies or substantial portions of the Software. 
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.

*
* @project: ab-nextjs-components
* @name: AbSplash - Tests (gate paths, storage failures, standalone, bots, CSP hash, inert)
* @file: __tests__/ab-splash.test.ts
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// 🧪 vitest
import { describe, expect, it } from 'vitest'
// 🚦 gate under test
import {
  AB_SPLASH_ATTRIBUTE,
  abSplashGateScript,
  buildAbSplashGateScript,
  buildAbSplashRootPathPattern,
  getAbSplashFadeMs,
  getAbSplashRemainingMs,
  setAbSplashBackgroundInert,
  type AbInertNode,
} from '../ab-splash/gate'
// 🔐 CSP helpers
import { AB_SPLASH_GATE_SHA256, buildAbSplashGate, getAbSplashGateSha256 } from '../ab-splash/csp'

// 🌍 the app's i18n config
const appOptions = { locales: ['en', 'fr', 'es', 'ru'], defaultLocale: 'en' }

// 🗄️ fake Storage (optionally throwing on get / set)
const makeStorage = (opts: { throwGet?: boolean; throwSet?: boolean; seed?: Record<string, string> } = {}) => {
  const data: Record<string, string> = { ...(opts.seed ?? {}) } // 📦 backing map
  return {
    data, // 🔍 exposed for assertions
    getItem: (k: string) => { if (opts.throwGet) throw new Error('get blocked'); return data[k] ?? null }, // 📖
    setItem: (k: string, v: string) => { if (opts.throwSet) throw new Error('set blocked'); data[k] = v }, // ✍️
  }
}

// 🏃 run the gate in a fake browser, return the <html> attribute (or null)
const runGate = (env: {
  path?: string; ua?: string; webdriver?: boolean; standalone?: boolean; displayModeStandalone?: boolean
  local?: ReturnType<typeof makeStorage>; session?: ReturnType<typeof makeStorage>; script?: string
} = {}) => {
  const attrs: Record<string, string> = {} // 🚩 <html> attributes
  const local = env.local ?? makeStorage() // 🗄️ localStorage
  const session = env.session ?? makeStorage() // 🗄️ sessionStorage
  const window = {
    navigator: { userAgent: env.ua ?? 'Mozilla/5.0 (X11; Linux x86_64) Chrome/130 Safari/537.36', webdriver: !!env.webdriver, standalone: env.standalone }, // 🧭
    matchMedia: () => ({ matches: !!env.displayModeStandalone }), // 📱
    location: { pathname: env.path ?? '/' }, // 📍
    localStorage: local, // 🗄️
    sessionStorage: session, // 🗄️
  }
  const document = { documentElement: { setAttribute: (k: string, v: string) => { attrs[k] = v } } } // 🌳
  new Function('window', 'document', env.script ?? buildAbSplashGateScript(appOptions))(window, document) // ▶️ run
  return { attr: attrs[AB_SPLASH_ATTRIBUTE] ?? null, local, session } // 📦 result
}

describe('AbSplash gate — root paths', () => {
  // 🧭 path → shows on first visit?
  const table: Array<[string, boolean]> = [
    ['/', true], ['/fr', true], ['/fr/', true], ['/ru/welcome', true], ['/welcome', true],
    ['/en', false], ['/de', false], ['/ab', false], ['/docs', false], ['/fr/docs', false], ['/zz/welcome', false], ['/en/welcome', false],
  ]
  it.each(table)('%s → %s', (path, shows) => {
    expect(runGate({ path }).attr).toBe(shows ? 'on' : null) // 🚦
  })

  it('builds the pattern from locales minus the default', () => {
    expect(buildAbSplashRootPathPattern(appOptions)).toBe('^(?:\\/(?:fr|es|ru))?(?:\\/(?:welcome))?\\/?$') // 🧭
    expect(buildAbSplashGateScript(appOptions)).toContain(JSON.stringify(buildAbSplashRootPathPattern(appOptions))) // 💉 JSON-injected
  })

  it('remembers the first visit', () => {
    const local = makeStorage() // 🗄️ shared storage
    expect(runGate({ local }).attr).toBe('on') // 👣 first
    expect(runGate({ local }).attr).toBeNull() // 🔁 second
  })
})

describe('AbSplash gate — storage failures', () => {
  it('a throwing getItem counts as already seen', () => {
    expect(runGate({ local: makeStorage({ throwGet: true }) }).attr).toBeNull() // 🚫
    expect(runGate({ standalone: true, local: makeStorage({ seed: { 'ab-splash-visited': '1' } }), session: makeStorage({ throwGet: true }) }).attr).toBeNull() // 🚫
  })
  it('a throwing setItem still shows (and does not throw)', () => {
    expect(runGate({ local: makeStorage({ throwSet: true }) }).attr).toBe('on') // ✅
  })
  it('missing storage objects do not throw', () => {
    expect(() => runGate({ local: null as never, session: null as never })).not.toThrow() // 🛟
  })
})

describe('AbSplash gate — standalone & bots', () => {
  // 👣 an already-visited user
  const seen = () => makeStorage({ seed: { 'ab-splash-visited': '1' } })
  it('iOS navigator.standalone shows once per session', () => {
    const session = makeStorage() // 🗄️
    expect(runGate({ path: '/docs', standalone: true, local: seen(), session }).attr).toBe('on') // 📱 first launch
    expect(runGate({ path: '/docs', standalone: true, local: seen(), session }).attr).toBeNull() // 🔁 same session
  })
  it('display-mode: standalone shows too', () => {
    expect(runGate({ path: '/docs', displayModeStandalone: true, local: seen() }).attr).toBe('on') // 📱
  })
  it('skips navigator.webdriver', () => {
    expect(runGate({ webdriver: true }).attr).toBeNull() // 🤖
  })
  it.each(['Googlebot/2.1', 'Mozilla/5.0 HeadlessChrome/130', 'Chrome-Lighthouse', 'facebookexternalhit/1.1'])('skips bot UA %s', (ua) => {
    expect(runGate({ ua }).attr).toBeNull() // 🤖
  })
})

describe('AbSplash gate — CSP hash', () => {
  it('hash matches the script bytes', () => {
    const { script, sha256 } = buildAbSplashGate(appOptions) // 🔐
    expect(sha256).toBe(getAbSplashGateSha256(script)) // ✅ same
    expect(sha256).toMatch(/^'sha256-[A-Za-z0-9+/]{43}='$/) // 🧾 format
    expect(AB_SPLASH_GATE_SHA256).toBe(getAbSplashGateSha256(abSplashGateScript)) // 📦 default
  })
  it('hash snapshot (update deliberately when the script changes)', () => {
    expect({ default: AB_SPLASH_GATE_SHA256, app: buildAbSplashGate(appOptions).sha256 }).toMatchSnapshot() // 📸
  })
  it('keeps // comments inside the script', () => {
    expect(abSplashGateScript).toMatch(/\n\s*\/\/ /) // 💬
  })
})

describe('AbSplash timing & inert', () => {
  it('caps and fades', () => {
    expect(getAbSplashRemainingMs(2000)).toBe(0) // ⏳
    expect(getAbSplashRemainingMs(-5)).toBe(1200) // ⏳
    expect(getAbSplashFadeMs(true)).toBe(0) // ♿
    expect(getAbSplashFadeMs(false)).toBe(200) // 🌫️
  })
  it('makes siblings inert up to <body> and restores them', () => {
    const body: AbInertNode = { tagName: 'BODY', parentElement: null, children: [] } // 🌳
    const main: AbInertNode = { tagName: 'MAIN', parentElement: body, children: [] } // 📄
    const wrap: AbInertNode = { tagName: 'DIV', parentElement: body, children: [] } // 📦
    const script: AbInertNode = { tagName: 'SCRIPT', parentElement: body, children: [] } // 🧾
    const overlay: AbInertNode = { tagName: 'DIV', parentElement: wrap, children: [] } // 💦
    const header: AbInertNode = { tagName: 'HEADER', parentElement: wrap, children: [] } // 🎩
    body.children = [main, wrap, script]; wrap.children = [header, overlay] // 🔗
    const restore = setAbSplashBackgroundInert(overlay) // 🙈
    expect([main.inert, header.inert, wrap.inert, overlay.inert, script.inert]).toEqual([true, true, undefined, undefined, undefined]) // ✅
    restore() // ↩️
    expect([main.inert, header.inert]).toEqual([false, false]) // ✅
  })
})
