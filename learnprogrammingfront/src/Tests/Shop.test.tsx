import React from "react";
import { mount } from "enzyme";
import { Shop } from "../Pages/Shop";
import { BrowserRouter } from "react-router-dom";

describe("Shop", () => {

  it("renders without errors", () => {
    const wrapper = mount(<BrowserRouter><Shop /> </BrowserRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});
