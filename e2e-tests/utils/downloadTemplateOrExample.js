module.exports = {
  downloadTemplateOrExample: async function (browser, buttonText) {
    await browser.click('xpath', `//*/button[contains(., '${buttonText}')]`);

    // Just check for file existence now since we download one
    // sample at a time--stupid version numbers
    const { value: fileDownloaded } = await browser.execute(
      `browserstack_executor: {"action": "fileExists"}`
    );
    await browser.pause(3000);
    // This just checks true or false value
    await browser.assert.ok(fileDownloaded);
  },
  buttonTexts: {
    templateExcel: 'Download Excel template',
    templateCSV: 'Download CSV template',
    exampleExcel: 'Download Excel sample data',
    exampleCSV: 'Download CSV sample data',
  },
};
