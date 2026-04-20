import { ToppingService } from "@/services";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToppingDialogAdd from "@/components/dialog/admin/topping.dialog";

jest.mock("@/services/admin.service", () => ({
    ToppingService: {
        createToppings: jest.fn(),
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("ToppingDialogAdd", () => {
    const mockProps = {
        isOpen: true,
        setIsOpen: jest.fn(),
        onAddSuccess: jest.fn(),
        dataEdit: null,
        setDataEdit: jest.fn(),
        onUpdateSuccess: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("submit thành công", async () => {
        (ToppingService.createToppings as jest.Mock).mockResolvedValue({
            topping: { id: 1, name: "Topping Test"},
            message: "Success",
        });

        render(<ToppingDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/name/i), "Topping Test");
        await user.type(screen.getByLabelText(/price/i), "10000");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(ToppingService.createToppings).toHaveBeenCalled();
            expect(mockProps.onAddSuccess).toHaveBeenCalled();
        });
    });

    it("show error khi API fail", async () => {
        (ToppingService.createToppings as jest.Mock).mockRejectedValue(
            new Error("API Error")
        );

        render(<ToppingDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/name/i), "Topping Test");
        await user.type(screen.getByLabelText(/price/i), "10000");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(ToppingService.createToppings).toHaveBeenCalled();
        });
    });
});