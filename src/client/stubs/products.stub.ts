import {ProductShortInfo} from "../../common/types";

const getStubData = ():ProductShortInfo[] => ([
    {id: 123, price: 100, name: "Product 123"},
    {id: 321, price: 500, name: "Product 321"},
    {id: 231, price: 230, name: "Product 231"},
    {id: 31, price: 1_000, name: "Product 31"},
    {id: 12, price: 3_100, name: "Product 12"},
]);

export const getStubShortProducts = (length?: number) => getStubData().slice(0, length);
