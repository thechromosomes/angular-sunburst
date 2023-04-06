import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3v4';
@Component({
  selector: 'app-sunburst-graph',
  templateUrl: './sunburst-graph.component.html',
  styleUrls: ['./sunburst-graph.component.css'],
})
export class SunburstGraphComponent implements OnInit {
  ngOnInit(): void {
    this.renderSunburstGraph();
  }

  renderSunburstGraph() {
    var rowData = {
      name: 'Vehicle',
      children: [
        {
          name: 'Domain1',
          children: [
            {
              name: 'ecu1',
              children: [
                {
                  name: 'ecu-Gen',
                  children: [
                    {
                      name: 'gen1',
                      size: 3938,
                    },
                    {
                      name: 'gen2',
                      size: 3812,
                    },
                    {
                      name: 'gen4',
                      size: 6714,
                    },
                    {
                      name: 'gen5',
                      size: 743,
                    },
                  ],
                },
              ],
            },
            {
              name: 'ecu2',
              children: [
                {
                  name: 'ecu-Gen',
                  children: [
                    {
                      name: 's1',
                      size: 3938,
                    },
                    {
                      name: 's2',
                      size: 3812,
                    },
                    {
                      name: 's3',
                      size: 6714,
                    },
                    {
                      name: 's4',
                      size: 743,
                    },
                  ],
                },
              ],
            },
            {
              name: 'ecu3',
              children: [
                {
                  name: 'ecu-Gen3',
                  children: [
                    {
                      name: 's3-1',
                      size: 3938,
                    },
                    {
                      name: 's3-2',
                      size: 3812,
                    },
                    {
                      name: 's3-3',
                      size: 6714,
                    },
                    {
                      name: 's3-4',
                      size: 743,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Domain2',
          children: [
            {
              name: 'ecu-2',
              children: [
                {
                  name: 'ecu-Gen2',

                  children: [
                    {
                      name: 's21',
                      size: 3938,
                    },
                    {
                      name: 'sg2',
                      size: 3812,
                    },
                    {
                      name: 'sg3',
                      size: 6714,
                    },
                    {
                      name: 'sg4',
                      size: 743,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Domain3',
          children: [
            {
              name: 'ecu-3',
              children: [
                {
                  name: 'ecu-Gen3',

                  children: [
                    {
                      name: 's21-3',
                      size: 3938,
                    },
                    {
                      name: 'sg2-3',
                      size: 3812,
                    },
                    {
                      name: 'sg3-3',
                      size: 6714,
                    },
                    {
                      name: 'sg4-3',
                      size: 743,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    let path: any;
    let text: any;
    let center: any;
    var width = 1200,
      height = 1000,
      radius = Math.min(width, height) / 2;

    var x = d3.scaleLinear().range([0, 2 * Math.PI]);

    var y = d3.scaleLinear().range([0, radius]);

    var color = d3
      .scaleOrdinal()
      .domain([0, 1, 2, 3, 4, 5]) // Set the color domain based on the depth of the element
      .range([
        '#00bfff',
        '#5bc0de',
        '#e6e6e6',
        '#f0ad4e',
        '#d9534f',
        '#292b2c',
      ]); // Set the color range for each depth level

    var partition = d3.partition();

    var tooltip = d3.select('#sunburst').append('div').classed('tooltip', true);
    tooltip.append('div').attr('class', 'label');
    tooltip.append('div').attr('class', 'count');
    tooltip.append('div').attr('class', 'percent');

    var svg = d3
      .select('#sunburst')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, width])
      .style('font', '16px sans-serif')
      .style('cursor', 'pointer')
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    var arc = d3
      .arc()
      .startAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
      })
      .endAngle(function (d) {
        return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
      })
      .innerRadius(function (d) {
        return Math.max(0, y(d.y0));
      })
      .outerRadius(function (d) {
        return Math.max(0, y(d.y1));
      });

    d3.json(
      // import the row json data here
      'data:text/json;charset=utf-8,' + JSON.stringify(rowData),
      function (error, root) {
        if (error) throw error;

        root = d3.hierarchy(root);
        root.sum(function (d) {
          return d.size;
        });

        svg
          .selectAll('path')
          .data(partition(root).descendants())
          .enter()
          .append('g')
          .attr('class', 'node');

        path = svg
          .selectAll('.node')
          .append('path')
          .attr('d', arc)
          .style('fill', function (d) {
            return color(d.depth);
          })
          .on('click', clickHandler)
          .on('mouseover', mouseOverHandler)
          .on('mouseout', mouseOutHandler)
          .on('mousemove', mouseMoveHandler);

        text = svg
          .selectAll('.node')
          .append('text')
          .attr('transform', function (d) {
            return 'rotate(' + computeTextRotation(d) + ')';
          })
          .attr('x', function (d) {
            return y(d.y0);
          })
          .attr('dx', '6')
          .attr('dy', '.35em')
          .text(function (d) {
            return d.data.name;
          })
          .on('click', clickHandler)
          .on('mouseover', mouseOverHandler)
          .on('mouseout', mouseOutHandler)
          .on('mousemove', mouseMoveHandler);
      }
    );

    function clickHandler(d) {
      //Hide text while Sunburst transitions
      text.transition().attr('opacity', 0);

      svg
        .transition()
        .duration(750)
        .tween('scale', function () {
          var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
          return function (t) {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));
          };
        })
        .selectAll('path')
        .attrTween('d', function (d) {
          return function () {
            return arc(d);
          };
        })
        .on('end', function (e, i) {
          // Check if the animated element's data e lies within the visible
          // angle span given in d:
          if (e.x0 >= d.x0 && e.x0 < d.x1) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select('text');
            // fade in the text element and recalculate positions
            arcText
              .transition()
              .duration(750)
              .attr('opacity', 1)
              .attr('transform', function () {
                return 'rotate(' + computeTextRotation(e) + ')';
              })
              .attr('x', function (d) {
                return y(d.y0);
              })
              .text(function (d) {
                return d.data.name === 'root' ? '' : d.data.name;
              });
          }
        });
    }

    function mouseOverHandler(d) {
      var total = d?.parent?.value;
      var percent = Math.round((1000 * d.value) / total) / 10; // calculate percent
      tooltip.select('.label').html(d.data.name); // set current label
      tooltip.select('.count').html(d.value); // set current count
      tooltip.select('.percent').html(percent + '%'); // set percent calculated above
      tooltip.style('display', 'block'); // set display
    }
    function mouseOutHandler() {
      // when mouse leaves div
      tooltip.style('display', 'none'); // hide tooltip for that element
    }
    function mouseMoveHandler(d) {
      // when mouse moves
      tooltip.style('top', d3.event.layerY + 10 + 'px'); // always 10px below the cursor
      tooltip.style('left', d3.event.layerX + 10 + 'px'); // always 10px to the right of the mouse
    }
    function computeTextRotation(d) {
      var angle = ((x((d.x0 + d.x1) / 2) - Math.PI / 2) / Math.PI) * 180;
      return angle > 90 || angle < 270 ? angle : 180 + angle;
    }
  }
}
