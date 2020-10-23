module.exports = {
  downloadTemplateOrExample: async function (browser, { buttonText, fileName, expect = true }) {
    await browser.click('xpath', `//*/button[contains(., '${buttonText}')]`);
    const { value: fileDownloaded } = await browser.execute(
      `browserstack_executor: {"action": "fileExists", "arguments": {"fileName": "${fileName}"}}`
    );
    await browser.pause(1000);
    // This just checks true or false value
    await browser.assert.ok(fileDownloaded === expect);
  },
  downloadOpts: {
    templateExcel: {
      buttonText: 'Download Excel template',
      fileName: 'ECE Data Collection Template.xlsx',
    },
    templateCSV: {
      buttonText: 'Download CSV template',
      fileName: 'ECE Data Collection Template.csv',
    },
    exampleExcel: {
      buttonText: 'Download Excel sample data',
      fileName: 'Example.xlsx',
    },
    exampleCSV: {
      buttonText: 'Download CSV sample data',
      fileName: 'Example.csv',
    },
  },
};
