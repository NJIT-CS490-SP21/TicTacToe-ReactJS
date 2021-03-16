import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  
  const loginButtonElement = screen.getByText('Login');
  expect(loginButtonElement).toBeInTheDocument();
  
  // fireEvent.click(loginButtonElement);
  // expect(loginButtonElement).not.toBeInTheDocument();
  
});
