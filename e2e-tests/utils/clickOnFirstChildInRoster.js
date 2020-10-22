module.exports = {
  clickOnFirstChildInRoster: async function (browser) {
    const childLinkSelectorArgs = ['xpath', "//*/a[contains(@href,'/edit-record')][1]"];
    const location = await browser.getLocation(...childLinkSelectorArgs);
    const { x, y } = location.value;
    await browser.execute(`window.scrollTo(${x},${y});`);
    await browser.waitForElementVisible(...childLinkSelectorArgs, 1000);
    await browser.click(...childLinkSelectorArgs);
    await browser.waitForElementVisible('xpath', `//*/h1[contains(., 'Edit record')]`);
    browser.assert.title('Edit record');
    // TODO: make ticket to deal with jwt expired error that happens when adding a child after being logged out

    // const firstNameSelectorArgs = ['css selector', 'input#firstName'];
    // await browser.waitForElementVisible(...firstNameSelectorArgs);
    // return await browser.getValue(...firstNameSelectorArgs);
  },
};
