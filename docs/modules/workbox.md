# 📦 Workbox Module

[![npm](https://img.shields.io/npm/dt/@nuxtjs/workbox.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/workbox)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/workbox/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/workbox)

Workbox is a collection of JavaScript libraries for Progressive Web Apps.
([Learn more](https://developers.google.com/web/tools/workbox)). This module adds full offline support using workbox.
Workbox module is only enabled on *production* builds.

You can pass options to `workbox` section in `nuxt.config.js` to override defaults.

```js
workbox: {
 // Workbox options
}
```

### Options

**dev** - Use dev build for workbox service worker lib.

**swURL** - If for any reason you need to register another service worker (OneSignal, etc) you can use this option.

**importScripts** (Array) - Additional scripts to be imported in service worker script. (Relative to `/`. Can be placed in `assets/` directory)

**offlineAnalytics** - (Default: false) Enable offline Google Analytics tracking [through workbox](https://developers.google.com/web/tools/workbox/guides/enable-offline-analytics)

For list of all available options see [here](https://developers.google.com/web/tools/workbox/modules/workbox-build)

### Adding custom runtimeCaching items (For CDN)

By default resources in dist (`/_nuxt/`) will be cached with CacheFirst and other requests to same domain will be cached with NetworkFirst strategy. Also all JS and CSS webpack emitted resources will be precached.

If you have a custom CDN and need to cache requests for it, simply use `runtimeCaching`:

nuxt.config.js
```js
workbox: {
      runtimeCaching: [
      {
        // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
        urlPattern: 'https://my-cdn.com/.*',
        // Defaults to `networkFirst` if omitted
        handler: 'cacheFirst',
        // Defaults to `GET` if omitted
        method: 'GET'
      }
    ]
}
```

#### Adding custom cache [StrategyOption](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-sw.Strategies#.StrategyOptions)
```js
workbox: {
   runtimeCaching: [
     {
       urlPattern: 'https://my-cdn.com/posts/.*',
       strategyOptions: {
         cacheName: 'our-cache',
         cacheExpiration: {
           maxEntries: 10,
           maxAgeSeconds: 300
         }
       }
     }
   ]
}
```

### Adding custom service worker

Create `static/custom-sw.js` file:

```js
console.log('Custom service worker!')
```

Add it with `importScripts` option in `nuxt.config.js`:

```js
workbox: {
  importScripts: [
      'custom-sw.js'
  ],
}
```
