// Nightwatch docs say that the library handles this for certain functions (like click) but it seems to not :(

module.exports = {
  scrollToElement: async function (
    browser,
    elSelectorArgs,
    waitForVisible = true
  ) {
    const location = await browser.getLocation(...elSelectorArgs);
    const { x, y } = location.value;
    await browser.execute(`window.scrollTo(${x},${y});`);
    // There are some elements that don't register as `visible` even though
    // they clearly show up on a page. Scrolling to them is still good, but
    // always checking for visibility might cause the test to fail for no
    // reason. See the readme for the distinction in nightwatch 'states'.
    if (waitForVisible) {
      await browser.waitForElementVisible(...elSelectorArgs, 1000);
    }
  },
};
