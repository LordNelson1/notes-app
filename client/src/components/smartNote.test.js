import React from "react";
import mockAxios from "axios";
import { shallow } from "enzyme";

import SmartNote from "./SmartNote";

const waiter = () => new Promise(resolve => setTimeout(resolve, 0));

describe("<SmartNote />", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<SmartNote />);
    expect(wrapper).toHaveLength(1);
  });
  describe("handleActions", () => {
    it("calls the api with success", async () => {
      const showNotification = jest.fn();
      const getNotes = jest.fn();
      const wrapper = shallow(
        <SmartNote showNotification={showNotification} getNotes={getNotes} />
      );

      const handleCloseModal = jest.spyOn(
        wrapper.instance(),
        "handleCloseModal"
      );

      const details = {
        title: "Hello",
        body: "Mate"
      };

      wrapper.setState(details);

      wrapper.instance().handleActions(true);
      expect(wrapper.state()).toEqual(expect.objectContaining(details));
      expect(wrapper.state().loading).toBe(true);
      await waiter();

      expect(wrapper.state().loading).toBe(false);
      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          title: "",
          body: ""
        })
      );
      expect(showNotification).toHaveBeenCalled();
      expect(getNotes).toHaveBeenCalled();
      expect(mockAxios.post).toHaveBeenCalled();
      expect(mockAxios.post).toHaveBeenCalledWith(
        "/notes/new",
        expect.objectContaining({
          data: details
        })
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith("title");
      expect(localStorage.removeItem).toHaveBeenCalledWith("body");
      expect(handleCloseModal).toHaveBeenCalled();
    });
  });
  describe("handleChange", () => {
    it("sets state and saves changes in localStorage", () => {
      const wrapper = shallow(<SmartNote />);
      const details = { name: "title", value: "titleValue" };
      wrapper.instance().handleChange({ target: details });

      expect(wrapper.state().title).toEqual(details.value);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        details.name,
        details.value
      );
    });
  });
});
