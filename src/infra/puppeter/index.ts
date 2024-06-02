import puppeteer, { Browser, Page } from "puppeteer";

export class PuppeteerClient {
  private url: string;
  private browser: Browser | null;
  public page: Page | null;

  constructor(url: string = "") {
    this.url = url;
    this.page = null;
    this.browser = null;
  }

  setUrl(url: string = "") {
    this.url = url;
  }

  async launch(): Promise<void> {
    const browser = await puppeteer.launch({
      slowMo: 10
    });
    this.browser = browser;
  }

  async gotoUrl(): Promise<void> {
    if (!this.url) {
      throw new Error("A url must be set to go to a page");
    }
    const page = await this.browser!.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36",
    );
    await page.goto(this.url);
    this.page = page;
  }

  async disconnect() {
    await this.browser!.close();
    this.browser = null;
  }
}
