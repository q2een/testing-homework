import {expect, test} from "@playwright/test";
import {CatalogPageObjectModel} from "@client/pages/test/Catalog/Catalog.pom";
import {ProductPageObjectModel} from "@client/pages/test/Product/Product.pom";
import {CartPageObjectModel} from "@client/pages/test/Cart/Cart.pom";

test("если добавить продукт и обновить страницу, элемент останется в корзине", async ({page}) => {
    const catalogPom = new CatalogPageObjectModel(page);
    const productPom = new ProductPageObjectModel(page);
    const cartPom = new CartPageObjectModel(page);

    await catalogPom.goto();
    await catalogPom.openProduct(await catalogPom.getLastProductId());

    await productPom.addToCart();
    await cartPom.goto();

    expect(await cartPom.countOrderProductsItems()).toBe(1);

    await page.reload();

    expect(await cartPom.countOrderProductsItems()).toBe(1);
})

test("если добавить товар несколько раз, то в корзине изменяется количество этого товара", async ({page}) => {
    const catalogPom = new CatalogPageObjectModel(page);
    const productPom = new ProductPageObjectModel(page);
    const cartPom = new CartPageObjectModel(page);

    await catalogPom.goto();
    await catalogPom.openProduct(await catalogPom.getLastProductId());

    const productName = await productPom.getProductName();

    await productPom.addToCart(5);
    await cartPom.goto();

    expect(await cartPom.getProductCount(productName)).toBe(5);
})
