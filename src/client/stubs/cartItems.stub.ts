import {CartState, ProductShortInfo} from "../../common/types";
import {getStubShortProducts} from "./products.stub";

export const getStubCartStateFromProduct = (products: ProductShortInfo[]): CartState => {
    return getStubCartFrom(products)
}

export const getStubCart = (length?: number): CartState => {
    return getStubCartStateFromProduct(getStubShortProducts(length))
}

export const getStubCartFrom = (items: Partial<ProductShortInfo & { id: number, count: number }>[]): CartState => {
    return items.reduce((accum, value, index) => {
        accum[value.id ?? index] = {
            name: value.name ?? `Product Name ${index}`,
            price: value.price ?? (index + 1) * 100,
            count: value.count ?? 1
        };
        return accum;
    }, {} as CartState)
}
