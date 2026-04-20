import { SliderService } from "@/services";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SliderDialogAdd from "@/components/dialog/admin/slider.dialog";

jest.mock("@/services/admin.service", () => ({
    SliderService: {
        createSlider: jest.fn(),
    },
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("SliderDialogAdd", () => {
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
        (SliderService.createSlider as jest.Mock).mockResolvedValue({
            slider: { id: 1, title: "Pizza", link: "https://test.com" },
            message: "Success",
        });

        render(<SliderDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/title/i), "Pizza");
        await user.type(screen.getByLabelText(/link/i), "https://test.com");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(SliderService.createSlider).toHaveBeenCalled();
            expect(mockProps.onAddSuccess).toHaveBeenCalled();
        });
    });

    it("show error khi API fail", async () => {
        (SliderService.createSlider as jest.Mock).mockRejectedValue(
            new Error("API Error")
        );

        render(<SliderDialogAdd {...mockProps} />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/title/i), "Pizza");
        await user.type(screen.getByLabelText(/link/i), "https://test.com");

        await user.click(screen.getByRole("button", { name: /add/i }));

        await waitFor(() => {
            expect(SliderService.createSlider).toHaveBeenCalled();
            expect(require("react-toastify").toast.error).toHaveBeenCalled();
        });
    });
});