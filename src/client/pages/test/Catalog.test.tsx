import {render, screen, waitFor, within} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import React from "react";
import {CartApi, ExampleApi} from "../../api";
import {initStore} from "../../store";
import {Catalog} from "../Catalog";
import {getStubShortProducts} from "../../stubs/products.stub";
import {getStubCartStateFromProduct} from "../../stubs/cartItems.stub";
import {mockApiResolvedValue, mockApiResolvedValueOnce} from "../../test-helpers/mocks/mockApiResults";
import {ProductShortInfo} from "../../../common/types";

jest.mock("../../api")
const mockCartApi = jest.mocked(new CartApi());
const mockExampleApi = jest.mocked(new ExampleApi(""));

const renderCatalog = () => {
    const store = initStore(mockExampleApi, mockCartApi);
    return render(
        <BrowserRouter>
            <Provider store={store}>
                <Catalog/>
            </Provider>
        </BrowserRouter>
    )
}

let stub: ProductShortInfo[]
beforeEach(() => {
    jest.resetAllMocks();
    mockCartApi.getState.mockReturnValue({})

    stub = getStubShortProducts();
    mockApiResolvedValue(mockExampleApi.getProducts, stub)
})

it("отображаются данные, полученные по апи", async () => {
    renderCatalog()

    await waitFor(() => {
        stub.forEach(product => {
            const container = screen.getAllByTestId(product.id)[0];
            expect(within(container).getByRole("heading", {level: 5, name: product.name})).toBeInTheDocument()
        })
    })
})

it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    renderCatalog()

    await waitFor(() => {
        stub.forEach(product => {
            const container = screen.getAllByTestId(product.id)[0];
            expect(within(container).getByRole("heading", {level: 5, name: product.name})).toBeInTheDocument();
            expect(within(container).getByText(`$${product.price}`)).toBeInTheDocument();
            expect(within(container).getByRole("link")).toHaveAttribute("href", `/catalog/${product.id}`);
        })
    })
})

it("если товар уже добавлен в корзину, отображается лейбл в карточке", async () => {
    const [productInCart, product] = getStubShortProducts(2);
    mockApiResolvedValueOnce(mockExampleApi.getProducts, [productInCart, product]);
    mockCartApi.getState.mockReturnValueOnce(getStubCartStateFromProduct([productInCart]))

    renderCatalog()

    await waitFor(() => {
        const container = screen.getAllByTestId(product.id)[0];
        expect(within(container).queryByText("Item in cart")).not.toBeInTheDocument();
    })

    await waitFor(() => {
        const container = screen.getAllByTestId(productInCart.id)[0];
        expect(within(container).getByText("Item in cart")).toBeInTheDocument();
    })
})
