// Nightwatch docs say that the library handles this for certain functions (like click) but it seems to not :(

module.exports = {
  scrollToElement: async function (browser, elSelectorArgs) {
    const location = await browser.getLocation(...elSelectorArgs);
    const { x, y } = location.value;
    await browser.execute(`window.scrollTo(${x},${y});`);
    await browser.waitForElementVisible(...elSelectorArgs, 1000);
  },
};
