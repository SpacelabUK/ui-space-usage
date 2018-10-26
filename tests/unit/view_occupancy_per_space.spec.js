import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Floorplan from "../../src/components/Floorplan.vue";

describe("FM views the occupancy for each space:", () => {
  context("Given the FM is on the dashboard, ", () => {
    context("and that a floorplan has been set up, ", () => {
      it("should display a floorplan of that floor", function() {
        expect(floorplanImg.attributes().src).equals(floorplanImgFilepath);
      });
      context(
        "and that the coordinates of a space (e.g. a meeting room) have been set for that floor, ",
        () => {
          it("should display the occupancy for that space, as a heatmap");
        }
      );
    });
  });
});
