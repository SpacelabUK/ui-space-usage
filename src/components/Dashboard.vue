<template>
  <div class="overall-dashboard-page">
    <p class="text-beautify page-header">Monitoring dashboard</p>
    <div class="row">
      <div 
        id="average-occupancy" 
        class="subColumn graphic">
        <h2 class="graphics-header">Average occupancy</h2>
      </div>
      <div 
        id="ocup-chart" 
        class="subColumn graphic">
        <h2 class="graphics-header">Percentage of spaces in each<br >
          occupancy profile
        </h2>
        <a 
          class="reset" 
          style="display:none" 
          href="javascript:pieChart.filterAll(); dc.redrawAll();"><ruby/>Reset</a>
      </div>
      <div 
        id="type-chart" 
        class="subColumn graphic space-type">
        <h2 class="graphics-header">Space type</h2>
        <a 
          class="reset" 
          style="display:none" 
          href="javascript:rowChart.filterAll(); dc.redrawAll();">Reset</a>
      </div>
    </div>
    <div class="row">
      <div 
        id="total-chart" 
        class="subRow graphic">
        <h2 class="graphics-header">Total number of people observed over time</h2>
        <a 
          class="reset" 
          style="display:none" 
          href="javascript:lineChart.filterAll(); dc.redrawAll();">Reset</a>
      </div>
    </div>
  </div>
</template>

<script>
import { getSpaceUsage } from "../services/get_space_usage.js";
import * as d3 from "d3";
const crossfilter = require("crossfilter2");
const dc = require("dc");

export default {
  created: async () => {
    try {
      const spaceUsageData = await getSpaceUsage({
        siteId: "1",
        dayStartTime: "08:00:00",
        dayEndTime: "18:00:00"
      });

      spaceUsageData.forEach(d => {
        const tempDate = new Date(d.usagePeriodStartTime);
        d.usagePeriodStartTime = tempDate;
      });

      const facts = crossfilter(spaceUsageData);

      // TABLE
      const dateDimension = facts.dimension(
        spaceUsage => spaceUsage.usagePeriodStartTime
      );

      // LINE CHART
      const peopleGroup = dateDimension
        .group()
        .reduceSum(d => d.numberOfPeopleRecorded);
      const minDate = dateDimension.bottom(1)[0].usagePeriodStartTime;
      const maxDate = dateDimension.top(1)[0].usagePeriodStartTime;
      const lineChart = dc
        .lineChart("#total-chart")
        .width(800)
        .height(200)
        .margins({
          top: 10,
          bottom: 30,
          right: 10,
          left: 35
        })
        .dimension(dateDimension)
        .group(peopleGroup)
        .yAxisLabel("# of people")
        .renderHorizontalGridLines(true)
        .renderArea(true)
        .x(d3.scaleTime().domain([minDate, maxDate]));

      lineChart.yAxis().ticks(6);
      lineChart.xAxis().ticks(6);

      // PIE CHART
      const qtyDimension = facts.dimension(spaceUsage => {
        const { occupancy } = spaceUsage;
        if (occupancy >= 0 && occupancy < 0.2) {
          return "occupied 0-20% occupied";
        } else if (occupancy >= 0.2 && occupancy < 0.4) {
          return "occupied 20-40% of the time";
        } else if (occupancy >= 0.4 && occupancy < 0.6) {
          return "occupied 40-60% of the time";
        } else if (occupancy >= 0.6 && occupancy < 0.8) {
          return "occupied 60-80% of the time";
        }
        return "occupied 80-100% of the time";
      });
      const qtyGroup = qtyDimension.group();

      const pieChart = dc
        .pieChart("#ocup-chart")
        .width(300)
        .height(320)
        .cx(150)
        .cy(100)
        .slicesCap(5)
        .radius(90)
        .innerRadius(40)
        .dimension(qtyDimension)
        .group(qtyGroup)
        .legend(
          dc
            .legend()
            .x(65)
            .y(210)
            .itemHeight(12)
        )
        .on("pretransition", chart => {
          chart
            .selectAll("text.pie-slice")
            .text(
              d =>
                `${Math.round(
                  dc.utils.printSingleValue(
                    ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
                  )
                )}%`
            );
        });

      // ROW TABLE
      const typeDimension = facts.dimension(d => d.spaceCategory);
      const typeGroup = typeDimension.group();

      const rowChart = dc
        .rowChart("#type-chart")
        .height(300)
        .group(typeGroup)
        .dimension(typeDimension);

      const occupancyGroup = facts.groupAll();

      const reduceAdd = (
        { sumOfOccupancy, noOfSpaceUsageRecords },
        spaceUsage
      ) => ({
        sumOfOccupancy: sumOfOccupancy + spaceUsage.occupancy,
        noOfSpaceUsageRecords: noOfSpaceUsageRecords + 1
      });

      const reduceRemove = (
        { sumOfOccupancy, noOfSpaceUsageRecords },
        spaceUsage
      ) => ({
        sumOfOccupancy: sumOfOccupancy - spaceUsage.occupancy,
        noOfSpaceUsageRecords: noOfSpaceUsageRecords - 1
      });

      const reduceInitial = () => ({
        sumOfOccupancy: 0,
        noOfSpaceUsageRecords: 0
      });

      occupancyGroup.reduce(reduceAdd, reduceRemove, reduceInitial);

      const numberDisplay = dc
        .numberDisplay("#average-occupancy")
        .group(occupancyGroup)
        .valueAccessor(({ sumOfOccupancy, noOfSpaceUsageRecords }) => {
          return sumOfOccupancy / noOfSpaceUsageRecords;
        })
        .formatNumber(d3.format(".0%"));

      dc.renderAll();
    } catch (error) {
      console.log(error);
    }
  }
};
</script>
