import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductDialogAdd from "@/components/dialog/admin/product.dialog";
import { AdminProductService } from "@/services/admin.service";

jest.mock("@/services/admin.service", () => ({
    AdminProductService: {
        createProduct: jest.fn(),
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("react-select", () => (props: any) => {
    return (
        <select
            data-testid="category-select"
            onChange={(e) =>
                props.onChange({ value: Number(e.target.value) })
            }
        >
        <option value="">Select</option>
            {props.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                {opt.label}
                </option>
            ))}
        </select>
    );
});

describe("ProductDialogAdd", () => {
    const mockProps = {
        isOpen: true,
        setIsOpen: jest.fn(),
        optionCategories: [{ value: 1, label: "Food" }],
        onAddSuccess: jest.fn(),
        dataEdit: null,
        setDataEdit: jest.fn(),
        onUpdateSuccess: jest.fn(),
        dataTopping: [],
        dataOptionGroup: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("submit thành công", async () => {
        (AdminProductService.createProduct as jest.Mock).mockResolvedValue({
            product: { id: 1, name: "Pizza" },
            message: "Success",
        });

        render(<ProductDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        // name
        await user.type(screen.getByLabelText(/name/i), "Pizza");

        // price
        await user.type(screen.getByPlaceholderText("0.00"), "2000");

        // category
        await user.selectOptions(screen.getByTestId("category-select"),"1");

        // submit
        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(AdminProductService.createProduct).toHaveBeenCalled();
            expect(mockProps.onAddSuccess).toHaveBeenCalled();
        });
    });

    it("show error khi API fail", async () => {
        (AdminProductService.createProduct as jest.Mock).mockRejectedValue(
            new Error("API Error")
        );

        render(<ProductDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/name/i), "Pizza");
        await user.type(screen.getByPlaceholderText("0.00"), "2000");
        await user.selectOptions(screen.getByTestId("category-select"),"1");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(AdminProductService.createProduct).toHaveBeenCalled();
        });
    });
});