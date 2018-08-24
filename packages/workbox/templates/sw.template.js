importScripts(<%= options.importScripts.map((i) => `'${i}'`).join(', ') %>)

workbox.precaching.precacheAndRoute([], <%= JSON.stringify(options.wbOptions, null, 2) %>)

<% if (options.cachingExtensions) { %><%= options.cachingExtensions %><% } %>

<% if (options.clientsClaim) { %>
workbox.clientsClaim()
<% } %>

<%
options.runtimeCaching.forEach(r => {
  const strategy = JSON.stringify(r.strategyOptions || {})
%>
workbox.routing.registerRoute(new RegExp('<%= r.urlPattern %>'), workbox.strategies.<%= r.handler %>(<%= strategy %>), '<%= r.method %>')
<% }) %>

<% if (options.offlinePage) { %>
// offlinePage support
const offlineRoute = new workbox.routing.NavigationRoute(
  async (args) => {
    try {
      const response = await offlineRoute.staleWhileRevalidate.handle(args)
      return response || caches.match('<%= options.offlinePage %>')
    } catch (error) {
      return caches.match('<%= options.offlinePage %>')
    }
  }
)
offlineRoute.staleWhileRevalidate = workbox.strategies.staleWhileRevalidate({
  cacheName: '<%= options.wbOptions.cacheId %>'
})
workbox.routing.registerRoute(new RegExp('/.*'), offlineRoute)<% } %>

<% if (options.routingExtensions) { %><%= options.routingExtensions %><% } %>
