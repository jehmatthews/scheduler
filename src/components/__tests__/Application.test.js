import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, queryByTestId, waitForElementToBeRemoved} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container,debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday")
    })

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {

    const { container } = render(<Application />)

    await waitForElement(() => getByText (container, "Archie Cohen"));

    const appointment = getAllByTestId (container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Rachel Green" }
    });

    fireEvent.click(queryByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Rachel Green"));
    
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Rachel Green" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //Wait until the saving is removed.
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
        
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(getByText(appointment, "Could not delete appointment")).toBeInTheDocument();
  })
  
});