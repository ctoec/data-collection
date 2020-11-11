import puppeteer from 'puppeteer';
import { UserRow, SiteConnectionOpts } from './create';
import fs from 'fs';

export const createWingedKeysUsers = async (
  userData: UserRow[],
  siteConnection: SiteConnectionOpts,
  passwordFile?: string
) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--headless', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto(`${siteConnection.url}/Account/Login`);

    await page.type('#Username', siteConnection.user);
    await page.type('#Password', siteConnection.password);
    await page.click('button[value="login"]');

    for (const _user of userData) {
      await page.goto(`${siteConnection.url}/Admin/NewAccount`);

      const [firstName, lastName] = _user.userName.split(' ');
      await page.type('#GivenName', firstName);
      await page.type('#FamilyName', lastName);
      await page.type('#Username', _user.email);
      await page.type('#Email', _user.email);

      const passPhrase = getPassphrase();
      await page.type('#Password', passPhrase);

      await page.click('button[value="create"]');

      if (!page.url().includes('success=true')) {
        const error = await page.$eval('strong', (el) => el.textContent);
        console.error(
          `Failed to create user ${_user.userName} - ${_user.email}:`,
          error
        );
      }

      if (passwordFile) {
        fs.appendFileSync(passwordFile, `${_user.email},${passPhrase}\n`);
      }
    }

    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Override impl on local when running
// to avoiding putting pw creation logic on public internet
function getPassphrase() {
  throw new Error('You need to implement this!');
  return '';
}
