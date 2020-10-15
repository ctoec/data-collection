module.exports = {
  makeSureNavIsOpen: async function (browser) {
    // If there's a menu button bc the screen is small, click it
    const menuButtonArgs = ['css selector', 'button.usa-menu-btn'];
    await browser.element(...menuButtonArgs, async (result) => {
      if (result.state === 'success') {
        await browser.click(...menuButtonArgs);
        await browser.waitForElementVisible('css selector', 'nav', 5000);
      } else {
        console.log('Menu not visible', { result });
        await browser.waitForElementVisible('css selector', 'nav', 5000);
      }
    });
  },
};
