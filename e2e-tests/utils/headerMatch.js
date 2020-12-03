module.exports = {
  /**
   * Test util that verifies desired h1 properties of a given page.
   * We want three conditions to be true:
   *  1) a page has exactly one h1 element
   *  2) that h1 has text that matches what we expect
   *  3) the page title matches the text of the h1
   * @param {*} browser
   * @param {*} expectedHeaderText
   */
  headerMatch: async function (browser, expectedHeaderText) {
    browser.expect.elements('h1').count.to.equal(1);
    browser.expect.element('h1').text.to.equal(expectedHeaderText);
    browser.expect.title().to.equal(expectedHeaderText);
  },
};
