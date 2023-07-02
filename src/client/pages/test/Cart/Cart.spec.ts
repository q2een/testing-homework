import {expect, test} from "@playwright/test";
import {ProductPageObjectModel} from "@client/pages/test/Product/Product.pom";
import {CartPageObjectModel} from "@client/pages/test/Cart/Cart.pom";
import {getStubProductSingle} from "@client/stubs/products.stub";
import {CheckoutResponse} from "common/types";
import {getStubCart} from "@client/stubs/cartItems.stub";
import {getStubCheckoutForm} from "@client/stubs/checkoutForm.stub";

test("если добавить продукт и обновить страницу, элемент останется в корзине", async ({page}) => {
    const productPom = new ProductPageObjectModel(page);
    const cartPom = new CartPageObjectModel(page);

    const productId = 13;
    await productPom.mockApiResponse(13);

    await productPom.goto(productId);
    await productPom.addToCart();
    await cartPom.goto();

    expect(await cartPom.countOrderProductsItems()).toBe(1);

    await page.reload();

    expect(await cartPom.countOrderProductsItems()).toBe(1);
});

test("если добавить товар несколько раз, то в корзине изменяется количество этого товара", async ({page}) => {
    const productPom = new ProductPageObjectModel(page);
    const cartPom = new CartPageObjectModel(page);

    const {id, ...stub} = getStubProductSingle({});
    await productPom.mockApiResponse(id, stub);

    await productPom.goto(id);
    await productPom.addToCart(5);

    await cartPom.goto();

    expect(await cartPom.getProductCount(stub.name)).toBe(5);
});

test("если заказать товар, появляется уведомление об успешном заказе", async ({page}) => {
    const productPom = new ProductPageObjectModel(page);
    const cartPom = new CartPageObjectModel(page);

    await cartPom.mockApiResponse(1)

    const productId = 13;
    await productPom.mockApiResponse(productId);

    await productPom.goto(productId);
    await productPom.addToCart();

    await cartPom.goto();
    await cartPom.fillCheckoutForm("Name", "1234567890", "Fake Address")
    await cartPom.submitCheckoutForm();

    await expect(cartPom.checkoutSuccessLocator).toHaveScreenshot();
});

test("ответ от сервера при создании заявки должен содержать корректный id", async ({request}) => {
    const cart = getStubCart(1);
    const form = getStubCheckoutForm()

    const response = await request.post(CartPageObjectModel.apiCheckoutUrl, {data: {form, cart}})
    const {id} = (await response.json()) as CheckoutResponse;

    expect(id).toBeLessThanOrEqual(2_000_000_000);
})