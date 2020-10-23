# e2e tests

Gotchas:

- Selenium/nightwatch/browserstack (not sure which) cares, for certain functions, about whether or not the element is currently on the screen. Nightwatch docs say that it scrolls the element into view for certain functions. This seems to be a lie. The `scrollToElement` util should actually do it though.

- Xpath arrays start at 1-- so if more than one el will be returned, use `[1]`, not `[0]`

- We have to use CommonJS modules, even though VSCode will try to tell you that you can use ES Modules
