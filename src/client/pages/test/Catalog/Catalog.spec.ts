import {expect, test} from "@playwright/test"
import {CatalogPageObjectModel} from "@client/pages/test/Catalog/Catalog.pom";
import {getStubShortProducts} from "@client/stubs/products.stub";
import {ProductPageObjectModel} from "@client/pages/test/Product/Product.pom";

test("каталог должен содержать карточки, полученные по апи и адаптироваться под размер экрана", async ({page}) => {
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

