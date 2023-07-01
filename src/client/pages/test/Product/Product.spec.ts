import {expect, test} from "@playwright/test"
import {ProductPageObjectModel} from "@client/pages/test/Product/Product.pom";
import {CatalogPageObjectModel} from "@client/pages/test/Catalog/Catalog.pom";

test("на странице продукта должна отображаться вся информация о продукте, кнопка добавления в корзину, лейбл о добавленном товаре", async ({page}) => {
    const productPom = new ProductPageObjectModel(page);

    const productId = 13;
    await productPom.mockApiResponse(productId)

    await productPom.goto(productId)

    await productPom.titleLocator.waitFor();
    await expect(productPom.cartBadgeLocator).toBeHidden();
    await productPom.addToCart();

    await expect(productPom.productLocator).toHaveScreenshot();
})

test("после получения данных, они отображаются на странице", async ({page}) => {
    const catalogPom = new CatalogPageObjectModel(page);
    const productPom = new ProductPageObjectModel(page);

    await catalogPom.goto();

    const productId = await catalogPom.getLastProductId();
    const responsePromise = productPom.waitForApiResponse(productId)
    await catalogPom.openProduct(productId);
    await responsePromise;

    await expect(productPom.titleLocator).toBeVisible();
})