# e2e tests

Gotchas:

- Selenium/nightwatch/browserstack (not sure which) cares, for certain functions, about whether or not the element is currently on the screen. Nightwatch docs say that it scrolls the element into view for certain functions. This seems to be a lie. The `scrollToElement` util should actually do it though.

- Xpath arrays start at 1-- so if more than one el will be returned, use `[1]`, not `[0]`

- We have to use CommonJS modules, even though VSCode will try to tell you that you can use ES Modules

- Most nightwatch functions take a selection type `xpath` or `css selector`. The option to do this on a given function is usually but not always indicated in the nightwatch docs. It is totally unclear whether this is required, though there are funcs that switch the browser to using one selector type to another... so we default here to specifying it. There are also some nightwatch functions that specifically do not take a selector even though the docs seem to indicate that they do (`browser.assert.containsText`, for example, only works when a selector was not specified and a css selector was used).

- Sometimes React changes take time to propagate, like when saving form data. `browser.pause()` is your friend.
