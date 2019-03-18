import React from "react";
import mockAxios from "axios";
import { shallow } from "enzyme";
import SmartCard from "./SmartCard";

describe("<SmartCard />", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<SmartCard title="title" body="body" />);

    expect(wrapper).toHaveLength(1);
  });

  describe("handleTitle", () => {
    it("calls the api with success", async () => {
      const _id = "id";
      const wrapper = shallow(
        <SmartCard title="old title" body="body" _id={_id} />
      );
      wrapper.setState({
        prevTitle: wrapper.state().title,
        title: "new title"
      });

      const handleUpdateMessage = jest.spyOn(
        wrapper.instance(),
        "handleUpdateMessage"
      );

      wrapper.instance().handleTitle();

      expect(mockAxios.put).toHaveBeenCalled();
      expect(mockAxios.put).toHaveBeenCalledWith(
        `/notes/${_id}`,
        expect.objectContaining({ data: { title: wrapper.state().title } })
      );

      expect(handleUpdateMessage).toHaveBeenCalled();
    });
  });
});
