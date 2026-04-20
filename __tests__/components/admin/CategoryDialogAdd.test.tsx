import { CategoryService } from "@/services";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryDialogAdd from "@/components/dialog/admin/category.dialog";

jest.mock("@/services/admin.service", () => ({
    CategoryService: {
        createCategories: jest.fn(),
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("CategoryDialogAdd", () => {
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
        (CategoryService.createCategories as jest.Mock).mockResolvedValue({
            category: { id: 1, name: "Pizza" },
            message: "Success",
        });

        render(<CategoryDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        // name
        await user.type(screen.getByLabelText(/name/i), "Pizza");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(CategoryService.createCategories).toHaveBeenCalled();
            expect(mockProps.onAddSuccess).toHaveBeenCalled();
        });
    });

    it("show error khi API fail", async () => {
        (CategoryService.createCategories as jest.Mock).mockRejectedValue(
            new Error("API Error")
        );

        render(<CategoryDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/name/i), "Pizza");
        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(CategoryService.createCategories).toHaveBeenCalled();
            expect(require("react-toastify").toast.error).toHaveBeenCalled();
        });
    });
});