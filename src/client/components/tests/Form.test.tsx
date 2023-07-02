import userEvent from "@testing-library/user-event";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {CheckoutFormData} from "common/types";
import React from "react";
import {Form, FormProps} from "@client/components/Form";
import {getStubCheckoutForm} from "@client/test-helpers/stubs/checkoutForm.stub";

const fillForm = (values: Partial<CheckoutFormData>) => {
    if (values.name !== undefined) {
        fireEvent.change(screen.getByLabelText("Name"), {target: {value: values.name}})
    }

    if (values.phone !== undefined) {
        fireEvent.change(screen.getByLabelText("Phone"), {target: {value: values.phone}})
    }

    if (values.address !== undefined) {
        fireEvent.change(screen.getByLabelText("Address"), {target: {value: values.address}})
    }
}

const submitForm = () => userEvent.click(screen.getByRole("button", {name: "Checkout"}))

const expectValidation = (label: string, isValidExpected = false) => {
    const invalidClassName = "is-invalid";
    const selector = screen.getByLabelText(label);

    if (isValidExpected) {
        return expect(selector).not.toHaveClass(invalidClassName)
    }

    expect(selector).toHaveClass(invalidClassName)
}

const mockOnSubmit = jest.fn<ReturnType<FormProps["onSubmit"]>, Parameters<FormProps["onSubmit"]>>();

it("если отправлена пустая форма, должны быть ошибки валидации", async () => {
    render(<Form onSubmit={mockOnSubmit}/>)

    await fillForm({});
    await submitForm();

    await waitFor(() => {
        expect(mockOnSubmit).not.toBeCalled();
    })

    await waitFor(() => {
        expectValidation("Name", false)
        expectValidation("Phone", false)
        expectValidation("Address", false)
    })
})

it("если телефон неправильного формата, должна быть ошибка валидации", async () => {
    render(<Form onSubmit={mockOnSubmit}/>)

    await fillForm(getStubCheckoutForm({phone: "123ase323"}));
    await submitForm();

    await waitFor(() => {
        expect(mockOnSubmit).not.toBeCalled();
    })

    await waitFor(() => {
        expectValidation("Phone", false)
        expectValidation("Name", true)
        expectValidation("Address", true)
    })
})

it("если все введенные данные корректны, форма отправляется", async () => {
    render(<Form onSubmit={mockOnSubmit}/>)
    const formValues = getStubCheckoutForm()

    await fillForm(formValues);
    await submitForm();

    await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenNthCalledWith(1, expect.objectContaining(formValues));
    })

    await waitFor(() => {
        expect(screen.getByRole("button", {name: "Checkout"})).toBeDisabled();
    })
})