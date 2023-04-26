import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Home from ".";

describe("Home", () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(["babbel.com", "google.com", "linkedin.com"]),
    })
  ) as jest.Mock;

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
  });
});
