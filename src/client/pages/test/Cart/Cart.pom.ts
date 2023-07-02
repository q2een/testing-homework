import {BaseStaticUrlPageObjectModel} from "@client/test-helpers/page-object-models/BaseApplication.pom";
import {Locator, Page} from "@playwright/test";

export class CartPageObjectModel extends BaseStaticUrlPageObjectModel {
    public static readonly apiCheckoutUrl = "./api/checkout"

    public readonly pageLocator: Locator;
    public readonly orderLocator: Locator;
    public readonly formLocator: Locator;
    public readonly checkoutSuccessLocator: Locator;

    constructor(page: Page) {
        super(page, "./cart");
        this.pageLocator = page.locator(".Cart");
        this.orderLocator = this.pageLocator.getByRole("table");
        this.formLocator = this.pageLocator.locator(".Form");
        this.checkoutSuccessLocator = this.pageLocator.locator(".Cart-SuccessMessage");
    }

    public async countOrderProductsItems() {
        return await this.orderLocator.locator("tr[data-testid]").count();
    }

    public async getProductCount(name: string): Promise<number> {
        const value = await this.orderLocator
            .locator("tr[data-testid]", {hasText: name})
            .locator(".Cart-Count")
            .innerText()

        return parseInt(value);
    }

    public async fillCheckoutForm(name: string, phone: string, address: string) {
        await this.formLocator.getByLabel("Name").type(name);
        await this.formLocator.getByLabel("Phone").type(phone);
        await this.formLocator.getByLabel("Address").type(address);
    }

    public async submitCheckoutForm() {
        await this.formLocator.getByRole("button").click();
    }

    public async mockApiResponse(checkoutId: number) {
        await this.page.route((url) => this.matchApiRequest(url.href), async route => {
            return await route.fulfill({json: {id: checkoutId}})
        });
    }

    public matchApiRequest(url: string): boolean {
        return url.endsWith(CartPageObjectModel.apiCheckoutUrl.slice(1))
    }
}