import {CheckoutFormData} from "common/types";

export const getStubCheckoutForm = (form?: Partial<CheckoutFormData>): CheckoutFormData => {
    return {
        name: form?.name ?? "James Bond",
        address: form?.address ?? "Fake Address",
        phone: form?.phone ?? "1234567890"
    }
}