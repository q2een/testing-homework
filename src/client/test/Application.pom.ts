import {Locator, Page, ViewportSize} from "@playwright/test";
import {
    ApplicationPageType,
    BaseApplicationPageObjectModel
} from "@client/test-helpers/page-object-models/BaseApplication.pom";

export class ApplicationPageObjectModel extends BaseApplicationPageObjectModel<"home"> {
    public static readonly StaticApplicationPages = BaseApplicationPageObjectModel
        .ApplicationPages
        .filter(x => x.type === "home" || x.type === "delivery" || x.type === "contacts");

    public static readonly HamburgerVisibleViewport: ViewportSize = {
        height: 400, width: 575
    }
    public static readonly HamburgerHiddenViewport: ViewportSize = {
        height: 400, width: 576
    }

    public readonly hamburgerLocator: Locator;
    public readonly hamburgerMenuLocator: Locator;

    constructor(page: Page) {
        super(page, "home");
        this.hamburgerLocator = page.getByRole("button", {name: "Toggle navigation"});
        this.hamburgerMenuLocator = page.locator("nav.navbar .navbar-nav");
    }

    public async gotoPage(pageType: ApplicationPageType) {
        await this.gotoAppPage(pageType)
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