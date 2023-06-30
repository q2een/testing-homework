import {fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import React from "react";
import {CartApi, ExampleApi} from "../../api";
import {initStore} from "../../store";
import {Cart} from "../Cart";
import {CartState, CheckoutFormData} from "../../../common/types";
import userEvent from "@testing-library/user-event";
import {mockApiResolvedValueOnce} from "../../test-helpers/mocks/mockApiResults";
import {getStubCart, getStubCartFrom} from "../../stubs/cartItems.stub";

jest.mock("../../api")
const mockCartApi = jest.mocked(new CartApi());
const mockExampleApi = jest.mocked(new ExampleApi(""));

const renderCart = () => {
    const store = initStore(mockExampleApi, mockCartApi);
    return render(
        <BrowserRouter>
            <Provider store={store}>
                <Cart/>
            </Provider>
        </BrowserRouter>
    )
}

it("в корзине должна отображаться таблица с добавленными в нее товарами", () => {
    const stub = getStubCart(2);
    mockCartApi.getState.mockReturnValueOnce(stub);

    renderCart()

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    Object.values(stub).forEach(product => {
        expect(within(table).getByText(product.name)).toBeInTheDocument();
    })
})

it("для каждого товара должны отображаться название, цена, количество, стоимость", () => {
    const stub = getStubCartFrom([{price: 100, count: 2}, {price: 20, count: 3}]);

    mockCartApi.getState.mockReturnValueOnce(stub);
    renderCart();

    Object.entries(stub).map(([id, value]) => {
        const line = screen.getByTestId(id);
        expect(line).toBeInTheDocument();

        expect(within(line).getByText(value.name)).toBeInTheDocument();
        expect(within(line).getByText(`$${value.price}`)).toBeInTheDocument();
        expect(within(line).getByText(value.count)).toBeInTheDocument();
        expect(within(line).getByText(`$${value.count * value.price}`)).toBeInTheDocument();
    })
})

it("должна отображаться общая сумма заказа", () => {
    mockCartApi.getState.mockReturnValueOnce(getStubCartFrom([{price: 10, count: 4}, {price: 22, count: 1}]));

    renderCart();
    expect(screen.getByText(`$62`)).toBeInTheDocument();
})

it("при нажатии на кнопку \"очистить корзину\", все товары удалятся", async () => {
    mockCartApi.getState.mockReturnValueOnce(getStubCart());

    renderCart();

    await userEvent.click(screen.getByRole("button", {name: "Clear shopping cart"}))
    await waitFor(() => {
        expect(screen.queryByRole("table")).not.toBeInTheDocument();
    })
})

it("если корзина пустая, вместо таблицы должна отображаться ссылка на каталог товаров", () => {
    mockCartApi.getState.mockReturnValueOnce({})
    renderCart();

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("link", {name: "catalog"})).toBeInTheDocument();
})

const fillForm = (values: Partial<CheckoutFormData>) => {
    fireEvent.change(screen.getByLabelText("Name"), {target: {value: values.name}})
    fireEvent.change(screen.getByLabelText("Phone"), {target: {value: values.phone}})
    fireEvent.change(screen.getByLabelText("Address"), {target: {value: values.address}})
}

const submitForm = () => userEvent.click(screen.getByRole("button", {name: "Checkout"}))

describe("Форма заказа", () => {
    const cartStub: CartState = getStubCart(2)
    const formStub: CheckoutFormData = {name: "James Bond", phone: "0070070000", address: "street"}

    beforeEach(() => {
        jest.resetAllMocks();
        mockCartApi.getState.mockReturnValue(cartStub);
    })

    it("если корзина пустая, не должна отображаться форма", () => {
        mockCartApi.getState.mockReturnValueOnce({});
        renderCart();
        expect(screen.queryByRole("heading", {level: 2, name: "Сheckout"})).not.toBeInTheDocument();
    })

    it("если корзина не пустая, должна отображаться форма", () => {
        renderCart();

        expect(screen.getByRole("heading", {level: 2, name: "Сheckout"})).toBeInTheDocument();
    })

    it("если форма засабмичена, создается заказ с содержимым формы и корзины", async () => {
        mockApiResolvedValueOnce(mockExampleApi.checkout, {id: 1})

        renderCart();
        fillForm(formStub);

        await submitForm()
        await waitFor(() => {
            expect(mockExampleApi.checkout).toHaveBeenNthCalledWith(1, expect.objectContaining(
                formStub,
            ), expect.objectContaining(cartStub))
        })

        await waitFor(() => {
            expect(screen.queryByRole("table")).not.toBeInTheDocument();
        })

        await waitFor(() => {
            expect(screen.getByRole("heading", {level: 4, name: "Well done!"})).toBeInTheDocument();
        })
    })
})
