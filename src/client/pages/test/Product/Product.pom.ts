import {Locator, Page} from "@playwright/test";
import {getStubProductSingle} from "@client/test-helpers/stubs/products.stub";
import {Product} from "common/types";
import {BasePageObjectModel} from "@client/test-helpers/page-object-models/Base.pom";

export class ProductPageObjectModel extends BasePageObjectModel {
    public readonly productLocator: Locator;
    public readonly titleLocator: Locator;
    public readonly descriptionLocator: Locator;
    public readonly priceLocator: Locator;
    public readonly colorLocator: Locator;
    public readonly materialLocator: Locator;

    public readonly buttonLocator: Locator;
    public readonly cartBadgeLocator: Locator;

    constructor(page: Page) {
        super(page);

        this.productLocator = page.locator(".Product");
        this.titleLocator = this.productLocator.getByRole("heading", {level: 1});
        this.descriptionLocator = this.productLocator.locator("ProductDetails-Description");
        this.priceLocator = this.productLocator.locator(".ProductDetails-Price");
        this.colorLocator = this.productLocator.locator(".ProductDetails-Color");
        this.materialLocator = this.productLocator.locator(".ProductDetails-Material");

        this.buttonLocator = this.productLocator.getByRole("button", {name: "Add to Cart"});
        this.cartBadgeLocator = this.priceLocator.locator(".CartBadge");
    }

    public matchApiRequest(url: string, productId: number): boolean {
        return url.endsWith(`/api/products/${productId}`)
    }

    public async mockApiResponse(productId: number, data?: Partial<Omit<Product, "id">>) {
        const product = getStubProductSingle({...data, id: productId});

        await this.page.route((url) => this.matchApiRequest(url.href, productId), async route => {
            return await route.fulfill({json: product})
        });
    }

    public waitForApiResponse(productId: number) {
        return this.page.waitForResponse((response) => this.matchApiRequest(response.url(), productId));
    }

    public async addToCart(count = 1) {
        await this.buttonLocator.click({clickCount: count})
    }

    public async getProductName() {
        return await this.page.getByRole("heading", {level: 1}).innerText();
    }

    public async goto(productId: number) {
        return await this.page.goto(`./catalog/${productId}`)
    }
}