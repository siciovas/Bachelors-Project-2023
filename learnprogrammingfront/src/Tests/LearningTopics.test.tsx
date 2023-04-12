import React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { LearningTopics } from "../Pages/LearningTopics";
import { BrowserRouter } from "react-router-dom";

describe("Shop", () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<BrowserRouter><LearningTopics /> </BrowserRouter>);
  });

  it("renders without errors", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
