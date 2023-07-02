import {Locator, Page, ViewportSize} from "@playwright/test";
import {HomePageObjectModel} from "@client/pages/test/Home/Home.pom";
import {ContactsPageObjectModel} from "@client/pages/test/Contants/Contacts.pom";
import {DeliveryPageObjectModel} from "@client/pages/test/Delivery/Delivery.pom";

export class ApplicationPageObjectModel extends HomePageObjectModel {
    public static StaticAppPages = [
        {title: "Главная", objectModel: HomePageObjectModel},
        {title: "Условия доставки", objectModel: DeliveryPageObjectModel},
        {title: "Контакты", objectModel: ContactsPageObjectModel}
    ]

    public static readonly HamburgerVisibleViewport: ViewportSize = {
        height: 400, width: 575
    }
    public static readonly HamburgerHiddenViewport: ViewportSize = {
        height: 400, width: 576
    }

    public readonly hamburgerLocator: Locator;
    public readonly hamburgerMenuLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.hamburgerLocator = page.getByRole("button", {name: "Toggle navigation"});
        this.hamburgerMenuLocator = page.locator("nav.navbar .navbar-nav");
    }

    public async setHamburgerHiddenViewport() {
        await this.page.setViewportSize(ApplicationPageObjectModel.HamburgerHiddenViewport)
    }

    public async setHamburgerVisibleViewport() {
        await this.page.setViewportSize(ApplicationPageObjectModel.HamburgerVisibleViewport)
    }

    public getMenuItemLocator(menuItemText: string) {
        return this.hamburgerMenuLocator.getByRole("link", {name: menuItemText});
    }
}