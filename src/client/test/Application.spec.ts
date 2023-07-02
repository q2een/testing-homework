import {expect, test} from '@playwright/test';
import {ApplicationPageObjectModel} from "@client/test/Application.pom";

test.describe("hamburger", () => {
    test.use({
        viewport: ApplicationPageObjectModel.HamburgerVisibleViewport
    })

    test.beforeEach(async ({page}) => {
        await new ApplicationPageObjectModel(page).goto();
    })

    test("если ширина меньше 576px, отображается 'гамбургер'", async ({page}) => {
        const pom = new ApplicationPageObjectModel(page);

        await expect(pom.hamburgerLocator).toBeVisible();
        await pom.setHamburgerHiddenViewport();
        await expect(pom.hamburgerLocator).toBeHidden();
    })

    test("при выборе элемента из меню \"гамбургера\", меню должно закрываться", async ({page}) => {
        const pom = new ApplicationPageObjectModel(page)

        await pom.hamburgerLocator.click();
        await expect(pom.hamburgerMenuLocator).toBeVisible();

        await pom.getMenuItemLocator("Catalog").click();

        await expect(pom.hamburgerMenuLocator).toBeHidden();
    })
})


test.describe("Статические страницы", () => {
    ApplicationPageObjectModel.StaticApplicationPages.forEach(({type, title}) => {
        test(`[Responsive] страница "${title}" адаптивная и со статическим контентом`, async ({page}) => {
            const pom = new ApplicationPageObjectModel(page);

            await pom.gotoPage(type);
            await expect(page).toHaveScreenshot({fullPage: true});
        })
    })
})
