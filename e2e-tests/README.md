# e2e tests

## Running tests

From `/e2e-tests` dir:

1. Install dependencies

```
$ yarn
```

1. Create .env file with browserstack credentials, or export env variables

```
$ cp .env.example .env // then, edit .env file
```

1. Run tests

```
$ yarn test
```

To filter tests by tag, use `--tag [tagname]` argument like

```
$ yarn test --tag upload
```

## Gotchas:

As an overview, the nightwatch docs are a good starting resource, but should NOT be taken as true. There are lots of instances where the docs will say one thing but the referenced function will have completely different behavior or use parameter signatures differently. If something isn't working the way the docs suggest, google around or try one of the common fixes below before scrapping the idea.

### About Selectors

- Most nightwatch functions take a selection type `xpath` or `css selector`. The option to do this on a given function is usually but not always indicated in the nightwatch docs. It is totally unclear whether this is required, though there are funcs that switch the browser to using one selector type to another... so we default here to specifying it. There are also some nightwatch functions that specifically do not take a selector even though the docs seem to indicate that they do (`browser.assert.containsText`, for example, only works when a selector was not specified and a css selector was used).

- xpath can be finnicky with its syntax, but here are some resources that can help you identify elements you need:

* https://www.swtestacademy.com/xpath-selenium/#xpath-text
* https://devhints.io/xpath

### Nits, or Death By Details

- We have to use CommonJS modules, even though VSCode will try to tell you that you can use ES Modules. This means imports from utils or other files follow a different signature than JS. They look like `const { login } = require('../utils/login');` (note the `require` rather than `import`).

- Xpath arrays start at 1-- so if more than one el will be returned, use `[1]`, not `[0]`

- Defining a test uses the following syntax:

```
module.exports = {
  '@tags': ['tag_name_here'],
  name_of_your_test_function: async function (browser) {
    await browser.init();
    // TODO: Your test code here
    browser.end();
  },
};
```

### Notes on Visibility

- Selenium/nightwatch/browserstack (not sure which) cares, for certain functions, about whether or not the element is currently on the screen. Nightwatch docs say that it scrolls the element into view for certain functions. This seems to be a lie. The `scrollToElement` util should actually do it though.

- Nightwatch's definition of `visible` isn't the same as your definition. That's because nightwatch makes a distinction between three different types of 'states' of elements on a page, but doesn't explain how they're different or when to use them. Here's what we've figured out:

* `present` elements are simply those that occur in a page's HTML. They can be visible, invisible, hidden, whatever; they're just there. _All_ elements should be considered `present`.
* `visible` elements are those that are `present`, and also can be seen by a viewer of the page (i.e. no hidden elements). What it means to be seen is somewhat murky, because things like disabled buttons or non-interactable form elements (see below) don't register as `visible`. The best working definition we have for `visible` is that an element is not hidden and is also 'active' on the page.
* `interactable` elements are those that are `present`, `visible`, and also can receive data input or be manipulated in some way. Text inputs in form fields are `interactable` elements, as are radio buttons (and yet, the checkboxes in our component library are not...). `Non-interactable` elements are also not considered `visible`. An element must be considered `interactive` by nightwatch in order for a test to `click()` on it.

### Sources of Frustration and Potential Solutions

- Make sure whatever element you're trying to manipulate on the page actually gets found by the test! Browserstack is king here because it will flag if an element doesn't get found. If that's the case, modify your selector, or try switching the kind of selector you're using (`xpath` if you were using `css selector`, and vice versa). The docs are not clear about which functions require which selector type, but many functions seem to only work with one or the other.

- Sometimes React changes take time to propagate, like when saving form data. If you try to move directly to the next step of your test without waiting for those change, it'll probably fail. There's a couple of things you can try if you know you're testing with screens that have load times:

* `browser.pause()` can be a really good friend.

* Using a `waitForElementVisible()` test with a high timeout setting (e.g. 5000ms or longer) as the last parameter can make sure the test doesn't go on until some known element shows up on the page.

* If you need a page to fully transition and an element to explicitly disappear before continuing, you can chain

```
browser.waitForElementNotPresent(...someElementSelectorArgs);
browser.waitForElementVisible(...newElementSelectorArgs);
```

This transition can come in handy if, for example, you're testing a page where a button must be clicked (maybe to submit something), and this triggers a new page to appear, but the content of that page isn't necessarily known so you're waiting for a `body` element.

- Due to some of the USWDS styling, there are elements that are hidden off-screen and replaced with `::before` tags. Nightwatch will deem these elements not `visible` and `non-interactable` even though they may show up on screen (which means that attempts to `waitForElementVisible` or `click` will fail). The workaround for this is to use a `css selector` on the label element instead, e.g. `selectorArgs = ['css selector', 'label[for=element-id]'`.

- If you're particularly struggling with flakiness or can't get syntax to find or manipulate an element you want, you can resort to direct JS injection in order to use the DOM. This is built into the nightwatch API to handle things their code doesn't cover (we use it in the `scrollToElement` util as well as the `login` util). The syntax for this uses the `execute()` command, as in:

```
await browser.execute(
  `document.querySelector('input#confidentiality-checkbox').click()`
);
```

This code, for example, uses the DOM to click on an element (a checkbox) that nightwatch considered not visible and not interactive, and so their functions couldn't locate or manipulate it.
