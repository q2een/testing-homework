import {BaseApplicationPageObjectModel} from "@client/test-helpers/page-object-models/BaseApplication.pom";
import {Locator, Page} from "@playwright/test";

export class CartPageObjectModel extends BaseApplicationPageObjectModel<"cart"> {
    public readonly orderLocator: Locator;

    constructor(page: Page) {
        super(page, "cart");
        this.orderLocator = page.getByRole("table")
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
}