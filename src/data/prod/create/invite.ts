import puppeteer from 'puppeteer';
import { UserRow, SiteConnectionOpts } from '../users/create';

export const invite = async (
  userData: UserRow[],
  siteConnection: SiteConnectionOpts
) => {
  let printBrowser;
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--headless', '--disable-setuid-sandbox'],
    });
    printBrowser = async () => {
      console.log('URL', page.url());
      console.log('CONTENT', await page.content());
    };
    const page = await browser.newPage();

    await page.goto(`${siteConnection.url}/Account/Login`);

    await page.type('#Username', siteConnection.user);
    await page.type('#Password', siteConnection.password);
    await page.click('button[value="login"]');
    await page.waitForTimeout(3000);

    for (const _user of userData) {
      console.log(`Trying to invite user ${_user.userName} at ${_user.email}`);
      await page.goto(`${siteConnection.url}/Admin/InviteUser`);
      await page.type('#Username', _user.email);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);

      const resultElement = await page.$('strong');
      const result = (await (
        await resultElement.getProperty('textContent')
      ).jsonValue()) as string;
      if (result.includes('No user found')) {
        console.error(
          `Failed to invite user ${_user.userName} at ${_user.email}`
        );
      } else {
        console.log(
          `Successfully invited user ${_user.userName} at ${_user.email}`
        );
      }
    }
  } catch (err) {
    console.error(err);
    if (printBrowser) await printBrowser();
    process.exit(1);
  }
};
