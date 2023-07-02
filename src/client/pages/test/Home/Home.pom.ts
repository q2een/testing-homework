import {BaseStaticUrlPageObjectModel} from "@client/test-helpers/page-object-models/BaseApplication.pom";
import {Page} from "@playwright/test";

export class HomePageObjectModel extends BaseStaticUrlPageObjectModel {
    constructor(page: Page) {
        super(page, "./");
    }
}