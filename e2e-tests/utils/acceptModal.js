module.exports = {
  acceptModal: async function (browser, buttonText, noModalText) {
    const modalButtonArgs = ['xpath', `//*/button[contains(., '${buttonText}')]`];
    await browser.element(...modalButtonArgs, async (result) => {
      if (result.state === 'success') {
        await browser.click(...modalButtonArgs);
      } else {
        console.log(noModalText);
      }
    });
  },
};
