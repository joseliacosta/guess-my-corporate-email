import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Home from ".";
import { useSubmitForm } from "@/services/data";

jest.mock("../services/data", () => ({
  useData: jest.fn(() => ({ data: ["google.com", "linkedin.com"] })),
  useSubmitForm: jest.fn(),
}));

describe("Home", () => {
  it("should render the form with 2 inputs and a submit button", () => {
    render(<Home />);

    expect(screen.getByText("Full name")).toBeInTheDocument();
    expect(screen.getByText("Company domain")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  describe("Form", () => {
    it("should not submit form if full name not contain at least 1 surname", async () => {
      render(<Home />);
      const fullNameInput = screen.getByRole("textbox");
      const searchButton = screen.getByRole("button");

      await userEvent.type(fullNameInput, "John");
      await userEvent.click(searchButton);

      expect(fullNameInput).toBeInvalid();
    });

    it("should not submit form if user not selected one option on company domains dropdown", async () => {
      render(<Home />);
      const fullNameInput = screen.getByRole("textbox");
      const companyDomainInput = screen.getByRole("combobox");
      const searchButton = screen.getByRole("button");
      await act(async () => {
        await userEvent.type(fullNameInput, "John Due");
        await userEvent.click(searchButton);
      });

      expect(companyDomainInput).toBeInvalid();
    });

    it("should submit form if user has all data valid", async () => {
      render(<Home />);

      // mock the return value of useSubmitForm
      const mockResult = { data: "johndoe@linkedin.com" };
      const mockUseSubmitForm = useSubmitForm as jest.MockedFunction<
        typeof useSubmitForm
      >;
      mockUseSubmitForm.mockResolvedValue(mockResult);

      const fullNameInput = screen.getByRole("textbox");
      const companyDomainInput = screen.getByRole("combobox");
      const searchButton = screen.getByRole("button");

      await act(async () => {
        await userEvent.type(fullNameInput, "John Due");
        await userEvent.selectOptions(companyDomainInput, "linkedin.com");
        await userEvent.click(searchButton);
      });

      expect(fullNameInput).toBeValid();
      expect(companyDomainInput).toBeValid();
      expect(mockUseSubmitForm).toHaveBeenCalledTimes(1);
      expect(mockUseSubmitForm).toHaveBeenCalledWith({
        fullName: "John Due",
        companyDomain: "linkedin.com",
      });
    });
  });
});
