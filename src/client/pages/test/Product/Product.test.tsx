import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import React from "react";
import {CartApi, ExampleApi} from "@client/api";
import {initStore} from "@client/store";
import {Product} from "@client/pages/Product";
import {getStubCart} from "@client/test-helpers/stubs/cartItems.stub";

jest.mock("@client/api")
const mockCartApi = jest.mocked(new CartApi());
const mockExampleApi = jest.mocked(new ExampleApi(""));

const PRODUCT_ID = 10;

const renderProduct = () => {
    const store = initStore(mockExampleApi, mockCartApi);
    return render(
        <MemoryRouter initialEntries={[{pathname: `/product/${PRODUCT_ID}`}]}>
            <Provider store={store}>
                <Product/>
            </Provider>
        </MemoryRouter>
    )
}

beforeEach(() => {
    jest.resetAllMocks();
    mockCartApi.getState.mockReturnValue(getStubCart(0))
})

it("при открытии страницы - загрузка", () => {
    renderProduct();

    expect(screen.getByText("LOADING")).toBeInTheDocument();
})