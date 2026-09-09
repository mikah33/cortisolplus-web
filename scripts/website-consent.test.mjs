import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as acquisition from '../src/lib/acquisition.js';

const component = fs.readFileSync(new URL('../src/components/WebsiteAnalytics.astro', import.meta.url), 'utf8');
const script = component.match(/<script>([\s\S]*?)<\/script>/)[1];
const compiled = ts.transpileModule(script, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function mount(preference = null) {
  const listeners = new Map();
  const scripts = [];
  const links = [{ href: 'https://apps.apple.com/app/id6759510126' }, { href: 'https://apps.apple.com/app/id123' }];
  const banner = { hidden: true };
  const storage = new Map(preference ? [['cortisol-website-privacy-v1', preference]] : []);
  const location = { protocol: 'https:', hostname: 'cortisolplus.com', pathname: '/download/', href: 'https://cortisolplus.com/download/?utm_campaign=website-qa-private&email=private@example.com', reload() { this.reloaded = true; } };
  class Element {
    constructor(kind, value) { this.kind = kind; this.value = value; }
    closest(selector) {
      if (selector === '[data-privacy-choice]' && this.kind === 'choice') return { dataset: { privacyChoice: this.value } };
      if (selector === 'a[href]' && this.kind === 'link') return this.value;
      return null;
    }
  }
  const window = {};
  const document = {
    referrer: 'https://chatgpt.com/c/private-conversation', title: 'Download Cortisol+',
    head: { append: element => scripts.push(element) },
    createElement: () => ({}),
    getElementById: () => banner,
    querySelector: () => ({ focus() {} }),
    querySelectorAll: selector => { assert.equal(selector, 'a[href]'); return links; },
    addEventListener(name, fn) { listeners.set(name, [...(listeners.get(name) || []), fn]); },
  };
  vm.runInNewContext(compiled, {
    exports: {}, require(name) { assert.equal(name, '../lib/acquisition.js'); return acquisition; },
    URL, Element, window, document, location,
    localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  });
  const dispatch = (name, event = {}) => { for (const fn of listeners.get(name) || []) fn(event); };
  return { links, scripts, window, location, dispatch, storage,
    consent: choice => dispatch('click', { target: new Element('choice', choice) }),
    click: () => dispatch('click', { target: new Element('link', links[0]) }),
  };
}

test('actual website script keeps links untagged without consent and sends one attributed click after consent', () => {
  const page = mount();
  page.dispatch('astro:page-load');
  page.click();
  assert.equal(page.scripts.length, 0);
  assert.equal(page.links[0].href, 'https://apps.apple.com/app/id6759510126');
  assert.equal(page.window.dataLayer, undefined);

  page.consent('analytics');
  assert.equal(page.links[0].href, 'https://apps.apple.com/app/apple-store/id6759510126?pt=128296964&ct=website-qa&mt=8');
  assert.equal(page.links[1].href, 'https://apps.apple.com/app/id123');
  for (let i = 0; i < 10; i++) page.dispatch('astro:page-load');
  page.click();
  const clicks = page.window.dataLayer.filter(args => args[0] === 'event' && args[1] === 'app_store_click');
  assert.equal(clicks.length, 1);
  assert.equal(clicks[0][2].app_store_campaign, 'website-qa');
  assert.equal(page.scripts.length, 1);
  assert.equal(page.window.fbq, undefined);
  assert.ok(!JSON.stringify(clicks).includes('private@example.com'));
  assert.ok(!JSON.stringify(clicks).includes('private-conversation'));

  page.consent('necessary');
  assert.equal(page.location.reloaded, true);
  const reloaded = mount(page.storage.get('cortisol-website-privacy-v1'));
  reloaded.dispatch('astro:page-load');
  reloaded.click();
  assert.equal(reloaded.links[0].href, 'https://apps.apple.com/app/id6759510126');
  assert.equal(reloaded.scripts.length, 0);
});
