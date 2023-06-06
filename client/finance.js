function main() {
  /*1*/ let svg = d3.select("svg"),
    margin = 120,
    /*2*/ width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

  svg
    /*3*/ .append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 100)
    .attr("y", 50)
    .attr("font-size", "40px")
    /*4*/ .text("Revenue");

  /*5, 6*/ let xScale = d3.scaleBand().range([0, width]).padding(0.2),
    /*7*/ yScale = d3.scaleLinear().range([height, 0]);

  let g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  /*8*/ d3.csv("test.csv").then(function (data) {
    /*9*/ xScale.domain(
      /*10*/ data.map(function (d) {
        return d.year;
      })
    );
    yScale.domain([
      0,
      /*11*/ d3.max(data, function (d) {
        return d.value;
      }),
    ]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      /*12*/ .call(d3.axisBottom(xScale))
      .append("text")
      .attr("y", height - 250)
      .attr("x", width - 100)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Year");

    g.append("g")
      .call(
        d3
          /*13, 14*/ .axisLeft(yScale)
          .tickFormat(function (d) {
            return "$" + d;
          })
          /*15*/ .ticks(10)
      )
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", "-4em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .attr("font-size", "15px")
      .text("Revenue");

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      /*16*/ .on("mouseover", onMouseOver) // Add listener for event
      .on("mouseout", onMouseOut)
      .attr("x", function (d) {
        return xScale(d.year);
      })
      .attr("y", function (d) {
        return yScale(d.value);
      })
      .attr("width", xScale.bandwidth())
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .delay(function (d, i) {
        return i * 50;
      })
      .attr("height", function (d) {
        return height - yScale(d.value);
      });
  });

  // Mouseover event handler

  function onMouseOver(d, i) {
    // Get bar's xy values, ,then augment for the tooltip
    var xPos = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
    var yPos = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

    // Update Tooltip's position and value
    d3.select("#tooltip")
      .style("left", xPos + "px")
      .style("top", yPos + "px")
      .select("#value")
      .text(i.value);

    d3.select("#tooltip").classed("hidden", false);

    d3.select(this).attr("class", "highlight");
    d3.select(this)
      .transition() // I want to add animnation here
      .duration(500)
      .attr("width", xScale.bandwidth() + 5)
      .attr("y", function (d) {
        return yScale(d.value) - 10;
      })
      .attr("height", function (d) {
        return height - yScale(d.value) + 10;
      });
  }

  // Mouseout event handler
  function onMouseOut(d, i) {
    d3.select(this).attr("class", "bar");
    d3.select(this)
      .transition()
      .duration(500)
      .attr("width", xScale.bandwidth())
      .attr("y", function (d) {
        return yScale(d.value);
      })
      .attr("height", function (d) {
        return height - yScale(d.value);
      });

    d3.select("#tooltip").classed("hidden", true);
  }
}

// d3.csv("test.csv", d3.autoType).then(function (dataset) {
//     d3.select("body")
//       .selectAll("div")
//       .data(dataset)
//       .enter()
//       .append("div")
//       .style("width", (d) => d * 40)
//       .style("height", "15px");
// });
