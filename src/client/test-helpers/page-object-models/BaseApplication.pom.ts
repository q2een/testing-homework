import {Page} from "@playwright/test";
import {BasePageObjectModel} from "@client/test-helpers/page-object-models/Base.pom";

export abstract class BaseStaticUrlPageObjectModel extends BasePageObjectModel {
    protected readonly url: string;

    protected constructor(page: Page, url: string) {
        super(page);
        this.url = url
    }

    public async goto() {
        await this.page.goto(this.url);
    }
}
