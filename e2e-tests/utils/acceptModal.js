module.exports = {
  acceptModal: async function (
    browser,
    buttonText,
    noModalText,
    enforceModal = false
  ) {
    const modalButtonArgs = [
      'xpath',
      `//*/button[contains(., '${buttonText}')]`,
    ];
    if (enforceModal) {
      await browser.waitForElementVisible(...modalButtonArgs);
      await browser.click(...modalButtonArgs);
    } else {
      await browser.element(...modalButtonArgs, async (result) => {
        if (result.state === 'success') {
          await browser.click(...modalButtonArgs);
        } else {
          console.log(noModalText);
        }
      });
    }
  },
};
