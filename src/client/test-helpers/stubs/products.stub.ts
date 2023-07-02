import {Product, ProductShortInfo} from "common/types";

const getStubData = (): Product[] => ([
    {id: 123, price: 100, name: "Product 123", color: "red", material: "wood", description: "fake description 123"},
    {id: 321, price: 500, name: "Product 321", color: "gray", material: "iron", description: "fake description 321"},
    {id: 231, price: 230, name: "Product 231", color: "green", material: "gold", description: "fake description 231"},
    {id: 31, price: 1_000, name: "Product 31", color: "orange", material: "sand", description: "fake description 31"},
    {id: 12, price: 3_100, name: "Product 12", color: "blue", material: "steel", description: "fake description 12"},
]);

export const getStubShortProducts = (length?: number): ProductShortInfo[] => {
    return getStubData()
        .map(({id, price, name}) => ({id, price, name}))
        .slice(0, length);
}

export const getStubProducts = (length?: number): Product[] => {
    return getStubData()
        .slice(0, length);
}

export const getStubProductSingle = (product: Partial<Product>): Product => {
    const [stub] = getStubProducts(1);

    return {
        id: product.id ?? stub.id,
        name: product.name ?? stub.name,
        price: product.price ?? stub.price,
        color: product.color ?? stub.color,
        description: product.description ?? stub.description,
        material: product.material ?? stub.material
    }
}
