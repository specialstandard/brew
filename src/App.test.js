import React from 'react';

import { render, fireEvent, getByTestId} from "@testing-library/react";
import App from './App'

it("App loads with initial hours state of 24", () => {
    const { container } = render(<App />);
    const hoursValue = getByTestId(container, "hoursValue");
    expect(hoursValue.value).toBe("24");
  });

it("Changes hours to 12 when selector changes to 12", () => {
    const { container } = render(<App />);
    const hoursValue = getByTestId(container, "hoursValue");
    fireEvent.change(hoursValue, { target: { value: "12" } });
    expect(hoursValue.value).toBe("12");
});
