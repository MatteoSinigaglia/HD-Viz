const d3 = require('d3');


/**
 * Plot force-directed graph of les Miserables example.
 * @param {data} table-formed-js array
 * @param {cols} set colums to be plotted. CAN contain gruper
 * @param {grouper} grouping column
 * @param {idBox} box to append
 */


const scpMatrix = function (data, cols, grouper, idBox) {
	const size = 180;
	//size = (width - (columns.length + 1) * padding) / columns.length + padding;
	const padding = 20;
	let columns = cols.filter(d => d !== grouper);

	var svg = d3.select('#'+idBox).append("svg");
	
	svg.append("style")
		.text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

    svg.classed("grafico", true)
		.attr("viewBox", [-2* padding, 0, size * columns.length + 3*padding, size * columns.length + padding])
		.attr("width", size * columns.length + padding)
		.attr("height", size * columns.length + padding)
		.append("g")
		.attr("transform", "translate(" + padding + ",0)");

	const xScale = columns.map(c => d3.scaleLinear()
		.domain(d3.extent(data, d => d[c]))
		.range([padding / 2, size - padding / 2]));

	const yScale = columns.map(c => d3.scaleLinear()
		.domain(d3.extent(data, d => d[c]))
		.range([size - padding / 2, padding / 2]));



	const xAxis = d3.axisBottom()
		.ticks(6)
		.tickSize(size * columns.length);

	var x = svg.append("g")
		.selectAll("g")
		.data(xScale)
		.join("g")
		.attr("transform", (d, i) => "translate(" + size * i + ",0)")
		.each(function (d) {
			return d3.select(this).call(xAxis.scale(d));
		})
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));


	const yAxis = d3.axisLeft()
		.ticks(6)
		.tickSize(-size * columns.length);

	var y = svg.append("g")
		.selectAll("g")
		.data(yScale)
		.join("g")
		.attr("transform", (d, i) => "translate(0," + size * i + ")")
		.each(function (d) {
			return d3.select(this).call(yAxis.scale(d));
		})
		.call(g => g.select(".domain").remove())
		.call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

		
	var colors = d3.scaleOrdinal()
		.domain(data.map(d => d[grouper]))
		.range(d3.schemeSet1);


	var cell = svg.append("g")
		.selectAll("g")
		.data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
		.join("g")
		.attr("transform", ([i, j]) => "translate(" + i * size + "," + j * size + ")");




	cell.append("rect")
		.attr("fill", "none")
		.attr("stroke", "#aaa")
		.attr("x", padding / 2 + 0.5)
		.attr("y", padding / 2 + 0.5)
		.attr("width", size - padding)
		.attr("height", size - padding);


	cell.each(function ([i, j]) {
		d3.select(this)
			.selectAll("circle")
			.data(data)
			.join("circle")
			.attr("cx", d => xScale[i](d[columns[i]]))
			.attr("cy", d => yScale[j](d[columns[j]]))
		});
	const circle = cell.selectAll("circle")
			.attr("r", 3.5)
			.attr("fill-opacity", 0.7)
			.attr("fill", d => colors(d[grouper]));


	svg.append("g")
		.style("font", "bold 10px sans-serif")
		.selectAll("text")
		.data(columns)
		.join("text")
		.attr("transform", (d, i) => "translate(" + i * size + "," + i * size + ")")
		.attr("x", padding)
		.attr("y", padding)
		.attr("dy", ".71em")
		.text(d => d);


	var brush = d3.brush()
		.extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]]);

	cell.call(brush);

	var brushCell;


	brush.on("start", function () {
		if (brushCell !== this) {
			d3.select(brushCell).call(brush.move, null);
			brushCell = this;
		}
	});

	brush.on("brush", function ({selection}, [i, j]) {
		let selected = [];
		if (selection) {
		const [[x0, y0], [x1, y1]] = selection; 
		circle.classed("hidden",
		d => {
			return x0 > xScale[i](d[columns[i]])
				|| x1 < xScale[i](d[columns[i]])
				|| y0 > yScale[j](d[columns[j]])
				|| y1 < yScale[j](d[columns[j]]);
		});
		selected = data.filter(
		d => {
				return x0 < xScale[i](d[columns[i]])
					&& x1 > xScale[i](d[columns[i]])
					&& y0 < yScale[j](d[columns[j]])
					&& y1 > yScale[j](d[columns[j]]);
			});
		}
		svg.property("value", selected).dispatch("input");
	});

	brush.on("end", function ({ selection }) {
		if (selection) return;
		svg.property("value", []).dispatch("input");
		circle.classed("hidden", false);
	});
}

exports.scpMatrix = scpMatrix;