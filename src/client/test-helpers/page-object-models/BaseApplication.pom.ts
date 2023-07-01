import {Page} from "@playwright/test";
import {BasePageObjectModel} from "@client/test-helpers/page-object-models/Base.pom";

interface ApplicationPage<TType extends string> {
    readonly title: string;
    readonly type: TType;
    readonly route: string;
}

const makeApplicationPage = <TType extends string>(title: string, type: TType, route?: string): ApplicationPage<TType> => {
    return {title, type, route: route ?? `./${type}`}
}

const applicationPages = [
    makeApplicationPage("Главная", "home", "./"),
    makeApplicationPage("Каталог", "catalog"),
    makeApplicationPage("Условия доставки", "delivery"),
    makeApplicationPage("Контакты", "contacts"),
    makeApplicationPage("Корзина", "cart"),
] satisfies ApplicationPage<string>[];

export type ApplicationPageType = typeof applicationPages extends ApplicationPage<infer TResult>[] ? TResult : never;

export abstract class BaseApplicationPageObjectModel<TPage extends ApplicationPageType> extends BasePageObjectModel {
    public readonly applicationPage: ApplicationPage<TPage>;

    protected static readonly ApplicationPages = applicationPages;

    protected constructor(page: Page, pageType: TPage) {
        super(page);
        this.applicationPage = this.getApplicationPageByType(pageType);
    }

    protected async gotoAppPage(pageType: ApplicationPageType) {
        await this.page.goto(this.getApplicationPageByType(pageType).route);
    }

    public async goto() {
        await this.page.goto(this.applicationPage.route);
    }

    private getApplicationPageByType<T extends ApplicationPageType>(pageType: ApplicationPageType): ApplicationPage<T> {
        return BaseApplicationPageObjectModel.ApplicationPages
            .find((x) => x.type === pageType) as ApplicationPage<T>;
    }
}
