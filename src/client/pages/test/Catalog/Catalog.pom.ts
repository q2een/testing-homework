import {BaseApplicationPageObjectModel} from "@client/test-helpers/page-object-models/BaseApplication.pom";
import {Locator, Page} from "@playwright/test";
import {ProductShortInfo} from "common/types";

export class CatalogPageObjectModel extends BaseApplicationPageObjectModel<"catalog"> {
    public readonly productItemsLocator: Locator;

    constructor(page: Page) {
        super(page, "catalog");
        this.productItemsLocator = page.locator(".Catalog div[data-testid]");
    }

    public async getLastProductId(): Promise<number> {
        const value = await this.productItemsLocator
            .locator("[data-testid]")
            .last()
            .getAttribute("data-testId")

        return parseInt(value, 10);
    }

    public async openProduct(productId: number) {
        const locator = this.productItemsLocator.getByTestId(productId.toString());
        await locator.getByRole("link").click();
    }

    public async mockApiResponse(data: ProductShortInfo[]) {
        await this.page.route((url) => this.matchApiRequest(url.href), async route => {
            return await route.fulfill({json: data})
        });
    }

    public matchApiRequest(url: string): boolean {
        return url.endsWith(`/api/products`)
    }

    public waitForApiResponse() {
        return this.page.waitForResponse((response) => this.matchApiRequest(response.url()));
    }
}