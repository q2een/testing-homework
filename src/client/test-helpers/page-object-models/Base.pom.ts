import {Page} from "@playwright/test";

export class BasePageObjectModel {
    constructor(protected readonly page: Page) {
    }
}