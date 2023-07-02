import {render, screen} from "@testing-library/react";
import React from "react";
import {Provider} from "react-redux";
import {BrowserRouter, MemoryRouter} from "react-router-dom";
import {CartApi, ExampleApi} from "@client/api";
import {initStore} from "@client/store";
import {Application} from "@client/Application";
import {getStubCart} from "@client/test-helpers/stubs/cartItems.stub";

jest.mock("@client/api")
const mockCartApi = jest.mocked(new CartApi());

const getStore = () => initStore(new ExampleApi(""), mockCartApi);

const renderApplication = () => {
    const store = getStore();
    render(
        <BrowserRouter>
            <Provider store={store}>
                <Application/>
            </Provider>
        </BrowserRouter>
    )
}

beforeEach(() => {
    jest.resetAllMocks();
    mockCartApi.getState.mockReturnValue({})
})

describe("Шапка", () => {
    it("в шапке есть ссылки на все страницы", () => {
        renderApplication();

        expect(screen.getByRole("link", {name: "Catalog"})).toHaveAttribute("href", "/catalog")
        expect(screen.getByRole("link", {name: "Delivery"})).toHaveAttribute("href", "/delivery")
        expect(screen.getByRole("link", {name: "Contacts"})).toHaveAttribute("href", "/contacts")
        expect(screen.getByRole("link", {name: "Cart", exact: false})).toHaveAttribute("href", "/cart")
    });

    it("логотип должен быть ссылкой на главную", () => {
        renderApplication()

        expect(screen.getByRole("link", {name: "Example store"})).toHaveAttribute("href", "/")
    });

    it("если корзина пуста, рядом с ней не отображается количество товаров", () => {
        renderApplication()

        expect(screen.getByRole("link", {name: "Cart", exact: true})).toBeInTheDocument();
    })

    it("если в корзине есть товары, отображается количество неповторяющихся товаров в ней", () => {
        mockCartApi.getState.mockReturnValueOnce(getStubCart(2))

        renderApplication()
        expect(screen.getByRole("link", {name: "Cart (2)", exact: true})).toBeInTheDocument();
    })
})

const renderAppOnRoute = (route: string) => {
    const store = getStore();
    render(<MemoryRouter initialEntries={[route]} initialIndex={0}>
        <Provider store={store}>
            <Application/>
        </Provider>
    </MemoryRouter>)
}

const expectRoute = (route: string, pageText: string) => {
    renderAppOnRoute(route);
    expect(screen.getByRole("heading", {level: 1, name: pageText},)).toBeInTheDocument();
}

describe("Страницы", () => {
    it("по адресу / должна открываться главная страница", () => {
        renderAppOnRoute("/")
        expect(screen.getByText("Welcome to Example store!")).toBeInTheDocument();
    })

    it("по адресу /catalog должна открываться страница 'Catalog'", () => {
        expectRoute("/catalog", "Catalog")
    })

    it("по адресу /delivery должна открываться страница 'Delivery'", () => {
        expectRoute("/delivery", "Delivery")
    })

    it("по адресу /contacts должна открываться страница 'Contacts'", () => {
        expectRoute("/contacts", "Contacts")
    })
})