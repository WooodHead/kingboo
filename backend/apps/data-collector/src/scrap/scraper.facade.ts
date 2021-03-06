import { BrowserService } from './browser.service';
import { CollectHotelsScenario } from '../core/interface/collect-hotels-scenario';
import { SearchPlaceScraper } from './search-place.scraper';
import { LaunchOptions } from 'puppeteer';
import { HotelsScraper } from './hotels.scraper';
import { ResultPageUrlBuilder } from './result-page-url.builder';
import { logger } from '../logger';

export class ScraperFacade {

  private readonly BASE_URL = 'https://www.booking.com';
  private readonly HOMEPAGE_WITH_DEFAULT_CURRENCY_AND_LANGUAGE: string = `${this.BASE_URL}/index.en-gb.html?selected_currency=PLN`;
  private readonly DEFAULT_RESOLUTION = {
    width: 1600,
    height: 900,
  };

  constructor(
    private readonly browserService: BrowserService,
    private readonly hotelsScraper: HotelsScraper,
    private readonly resultPageUrlBuilder: ResultPageUrlBuilder,
    private readonly searchPlaceScraper: SearchPlaceScraper,
  ) {
  }

  public async initializeBrowser(launchOptions: LaunchOptions): Promise<void> {
    logger.debug(`Initializing browser with options`, launchOptions);
    await this.browserService.initBrowserAndOpenBlankPage(launchOptions);

    logger.debug(`Set page size`, this.DEFAULT_RESOLUTION);
    await this.browserService.setPageSize(this.DEFAULT_RESOLUTION);

    const pages = await this.browserService.getPages();
    const userAgent = await this.browserService.getUserAgent();
    logger.debug(`Initializing browser. Open pages: `, (pages || []).map((p) => ({ url: p.url() })));
    logger.debug(`Initializing browser. User agent: `, userAgent);
  }

  public async prepareResultList(searchPlaceIdentifier: string,
                                 collectHotelsScenario: CollectHotelsScenario,
                                 enableStyles: boolean): Promise<number> {
    logger.debug(`Building result page uri based on search place identifier [${searchPlaceIdentifier}]`);
    const resultPageUri = this.resultPageUrlBuilder.fromSearchPlaceIdentifierAndScenarioParams(searchPlaceIdentifier, collectHotelsScenario);

    logger.debug(`Preparing result list.`);
    return this.hotelsScraper.prepareResultList(resultPageUri, enableStyles);
  }

  public async collectSearchPlaceIdentifier(searchPlace: string): Promise<string> {
    logger.debug(`Starting search place identifier collecting.`);
    return this.searchPlaceScraper.collectSearchPlaceIdentifier(this.HOMEPAGE_WITH_DEFAULT_CURRENCY_AND_LANGUAGE, searchPlace);
  }

  public async collectHotelsFromCurrentPage() {
    return this.hotelsScraper.collectHotelsFromCurrentPage();
  }

  public async takeScreenshot(type: string, resultFolderPath: string) {
    return this.browserService.takeScreenshot(type, resultFolderPath);
  }

  public async performCleaningAfterScraping(): Promise<void> {
    const pagesBefore = await this.browserService.getPages();
    const userAgent = await this.browserService.getUserAgent();
    logger.debug('Closing browser. Open pages:', (pagesBefore || []).map((p) => ({ url: p.url() })));
    logger.debug(`Closing browser. User agent: `, userAgent);
    await this.browserService.closeBrowser();
    const pagesAfter = await this.browserService.getPages();
    logger.debug('Browser closed. Open pages:', (pagesAfter || []).map((p) => ({ url: p.url() })));
  }
}
