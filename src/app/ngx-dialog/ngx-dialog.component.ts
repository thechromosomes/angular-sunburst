import { Component, Input, EventEmitter, Output } from "@angular/core";
import * as d3 from "d3v4";

@Component({
  selector: "app-ngx-dialog",
  templateUrl: "./ngx-dialog.component.html",
  styleUrls: ["./ngx-dialog.component.css"],
})
export class NgxDialogComponent {
  @Input() isVisible: boolean;
  @Output() onClose = new EventEmitter<any>();
  @Input() public title: string;
  closeHandler() {
    this.onClose.emit();
  }

  ngOnInit() {
    this.renderGraph();
  }

  renderGraph() {
    let rowData = {
      nodes: [
        { id: "node0", group: "ecugeneration" },
        { id: "node1", group: "ecugeneration" },
        { id: "node2", group: "software" },
        { id: "node3", group: "software" },
      ],

      links: [
        { source: "node0", target: "node1" },
        { source: "node0", target: "node2" },
        { source: "node1", target: "node2" },
        { source: "node2", target: "node3" },
      ],
    };

    const container = document.querySelector("#graphContainer");

    const width = container.clientWidth;
    const height = container.clientHeight;

    var svg = d3
      .select("#graphContainer")
      .append("svg")
      .style("font", "16px sans-serif")
      .style("cursor", "pointer")
      .attr("width", width)
      .attr("height", height);

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function (d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json(
      "data:text/json;charset=utf-8," + JSON.stringify(rowData),
      function (error, graph) {
        if (error) throw error;

        graph.links.forEach(function (d) {
          d.source = d.source;
          d.target = d.target;
        });

        var link = svg
          .append("g")
          .style("stroke", "#aaa")
          .selectAll("line")
          .data(graph.links)
          .enter()
          .append("line");

        var node = svg
          .append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter()
          .append("circle")
          .attr("r", 6)
          .call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          );

        var label = svg
          .append("g")
          .attr("class", "labels")
          .selectAll("text")
          .data(graph.nodes)
          .enter()
          .append("text")
          .attr("class", "label")
          .text(function (d) {
            return d.group;
          })
          .call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          );

        simulation.nodes(graph.nodes).on("tick", ticked);

        simulation.force("link").links(graph.links);

        function ticked() {
          link
            .attr("x1", function (d) {
              return d.source.x;
            })
            .attr("y1", function (d) {
              return d.source.y;
            })
            .attr("x2", function (d) {
              return d.target.x;
            })
            .attr("y2", function (d) {
              return d.target.y;
            });

          node
            .attr("r", 20)
            .style("fill", "#d9d9d9")
            .style("stroke", "#969696")
            .style("stroke-width", "1px")
            .attr("cx", function (d) {
              return d.x + 6;
            })
            .attr("cy", function (d) {
              return d.y - 6;
            });

          label
            .attr("x", function (d) {
              return d.x;
            })
            .attr("y", function (d) {
              return d.y;
            })
            .style("font-size", "20px")
            .style("fill", "#4393c3");
        }
      }
    );

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = d.x;
      d.fy = d.y;
    }
  }
}
