module.exports = {
  downloadTemplateOrExample: async function (browser, buttonText) {
    await browser.click('xpath', `//*/button[contains(., '${buttonText}')]`);

    // Check that a file has been downloaded in this test session
    const { value: fileDownloaded } = await browser.execute(
      `browserstack_executor: {"action": "fileExists"}`
    );
    await browser.pause(3000);
    await browser.assert.ok(fileDownloaded);
  },
  buttonTexts: {
    templateExcel: 'Download Excel template',
    templateCSV: 'Download .csv template',
    exampleExcel: 'Download Excel sample data',
    exampleCSV: 'Download .csv sample data',
  },
};
