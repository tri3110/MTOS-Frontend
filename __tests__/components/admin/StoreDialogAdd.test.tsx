import { StoreService } from "@/services";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StoreDialogAdd from "@/components/dialog/admin/store.dialog";

jest.mock("@/services/admin.service", () => ({
    StoreService: {
        createStore: jest.fn(),
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("StoreDialogAdd", () => {
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
        (StoreService.createStore as jest.Mock).mockResolvedValue({
            store: { id: 1, name: "Chi Nhanh test", address: "123 Main St", phone: "555-1234" },
            message: "Success",
        });

        render(<StoreDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/name/i), "Chi Nhanh test");
        await user.type(screen.getByLabelText(/address/i), "123 Main St");
        await user.type(screen.getByLabelText(/phone/i), "555-1234");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(StoreService.createStore).toHaveBeenCalled();
            expect(mockProps.onAddSuccess).toHaveBeenCalled();
        });
    });

    it("show error khi API fail", async () => {
        (StoreService.createStore as jest.Mock).mockRejectedValue(
            new Error("API Error")
        );

        render(<StoreDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/name/i), "Chi Nhanh test");
        await user.type(screen.getByLabelText(/address/i), "123 Main St");
        await user.type(screen.getByLabelText(/phone/i), "555-1234");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(StoreService.createStore).toHaveBeenCalled();
            expect(require("react-toastify").toast.error).toHaveBeenCalled();
        });
    });
});