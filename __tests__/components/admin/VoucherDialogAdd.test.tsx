import { VoucherService } from "@/services";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VoucherDialogAdd from "@/components/dialog/admin/voucher.dialog";

jest.mock("@/services/admin.service", () => ({
    VoucherService: {
        createVoucher: jest.fn(),
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("VoucherDialogAdd", () => {
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
        (VoucherService.createVoucher as jest.Mock).mockResolvedValue({
            voucher: { id: 1, code: "VOUCHER123" },
            message: "Success",
        });

        render(<VoucherDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/code/i), "VOUCHER123");
        await user.type(screen.getByTestId("discount-value"), "10");
        await user.selectOptions(screen.getByTestId("discount-type"),"percent");
        await user.type(screen.getByTestId("max-usage"), "5");
        await user.type(screen.getByTestId("min-order-value"), "100000");
        await user.type(screen.getByTestId("expired-at"), "2023-12-31T23:59");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(VoucherService.createVoucher).toHaveBeenCalled();
            expect(mockProps.onAddSuccess).toHaveBeenCalled();
        });
    });

    it("show error khi API fail", async () => {
        (VoucherService.createVoucher as jest.Mock).mockRejectedValue(
            new Error("API Error")
        );

        render(<VoucherDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/code/i), "VOUCHER123");
        await user.type(screen.getByTestId("discount-value"), "10");
        await user.selectOptions(screen.getByTestId("discount-type"),"percent");
        await user.type(screen.getByTestId("max-usage"), "5");
        await user.type(screen.getByTestId("min-order-value"), "100000");
        await user.type(screen.getByTestId("expired-at"), "2023-12-31T23:59");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(VoucherService.createVoucher).toHaveBeenCalled();
        });
    });
});