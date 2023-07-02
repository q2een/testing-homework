import {expect, test} from "@playwright/test"
import {CatalogPageObjectModel} from "@client/pages/test/Catalog/Catalog.pom";
import {getStubShortProducts} from "@client/test-helpers/stubs/products.stub";
import {ProductPageObjectModel} from "@client/pages/test/Product/Product.pom";

test("[Responsive] каталог должен содержать карточки, полученные по апи и адаптироваться под размер экрана", async ({page}) => {
    const catalogPom = new CatalogPageObjectModel(page);
    const productPom = new ProductPageObjectModel(page);

    const data = getStubShortProducts();
    const {id: productId, ...rest} = data[data.length - 1];
    await productPom.mockApiResponse(productId, rest);
    await catalogPom.mockApiResponse(data);

    await productPom.goto(productId);
    await productPom.titleLocator.waitFor();
    await productPom.addToCart();

    const response = catalogPom.waitForApiResponse();
    await catalogPom.goto();
    await response;

    await expect(page).toHaveScreenshot({fullPage: true})
})

test("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async ({page}) => {
    const catalogPom = new CatalogPageObjectModel(page);

    const response = catalogPom.waitForApiResponse();
    await catalogPom.goto();
    await response;

    const items = await catalogPom.productItemsLocator.all();
    for (const item of items) {
        const titleTextContent = await catalogPom.getProductItemElementLocator(item, "title").textContent();
        expect(titleTextContent.length).toBeGreaterThan(0);

        const priceTextContent = await catalogPom.getProductItemElementLocator(item, "price").textContent();
        expect(priceTextContent.length).toBeGreaterThan(1);

        const linkTextContent = await catalogPom.getProductItemElementLocator(item, "link").textContent();
        expect(linkTextContent.length).toBeGreaterThan(0);
    }
})

