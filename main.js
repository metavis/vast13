/**
 * Created with JetBrains WebStorm.
 * User: ziyuan
 * Date: 13-1-27
 * Time: 上午2:30
 * To change this template use File | Settings | File Templates.
 */

var SVGSize = 700;
var MiniplotSize = 100;
var CircleRadius = 3;
var Margin = 10;
var ScaleWithPadding = d3.scale.linear()
    .domain([0, 1])
    .range([Margin, SVGSize - Margin]);

var PCAColorMap = CreatePCAColorMap(40);
var PCAMiniplotText=CreatePCAMiniplotText(40);

var circlePCAPrefix = "pca_circ_";
var miniplotPCAPrefix = "pca_mini_";

$(function () {
    PlotJSON("#plot_pca", "data/nerv_pca.json", "data/views_pca");
});

function PlotJSON(divId, fileName, viewFolder) {
    var plot = d3.select(divId);
    var svg = plot.select("svg");
    svg.remove();
    svg = plot.append("svg");
    svg.attr("width", SVGSize)
        .attr("height", SVGSize)
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", SVGSize)
        .attr("height", SVGSize)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    d3.json(fileName, function (json) {

        svg.selectAll("circle")
            .data(json)
            .enter()
            .append("circle")
            .attr("id", function (d, i) {
                var idx = sprintf("%03d", i + 1);
                return(circlePCAPrefix + idx);
            })
            .attr("cx", function (d) {
                return(ScaleWithPadding(d[0]));
            })
            .attr("cy", function (d) {
                return(ScaleWithPadding(d[1]));
            })
            .attr("r", CircleRadius)
            .attr("fill", function (d, i) {
                return(PCAColorMap[i]);
            })
            .on("mouseover", function (d, i) {
                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];
                var miniplot_id = sprintf("#%s%03d", miniplotPCAPrefix, i);
                d3.select(miniplot_id)
                    .style("top", y + "px")
                    .style("left", x + "px")
                    .style("display", "block");

            })
            .on("mouseout", function (d, i) {
                var miniplot_id = sprintf("#%s%03d", miniplotPCAPrefix, i);
                d3.select(miniplot_id)
                    .style("display", "none");
            });


        var miniplots = plot.selectAll("div")
            .data(json)
            .enter()
            .append("div");

        miniplots.attr("id", function (d, i) {
                var idx = sprintf("%03d", i + 1);
                return(miniplotPCAPrefix + idx);
            })
            .style("width", MiniplotSize + "px")
            .style("height", (MiniplotSize+10) + "px")
            .style("position", "absolute")
            .style("display", "none");

        miniplots.append("img")
            .attr("src", function (d, i) {
                var idx = sprintf("%03d", i + 1);
                return (viewFolder + "/" + idx + ".png");
            })
            .attr("width", MiniplotSize)
            .attr("height", MiniplotSize);

        miniplots.append("p")
            .append("small")
            .text(function(d,i){
                return(PCAMiniplotText[i]);
            });
    });
}

function CreatePCAColorMap(ndim) {
    var colorMap = new Array(ndim * (ndim - 1) / 2);
    var idx = 0;
    for (var i = 1; i < ndim; i++) {
        var greenValue = Math.floor((ndim - i) * 255 / ndim + 255 / (2 * ndim));
        for (var j = i + 1; j <= ndim; j++) {
            var redValue = Math.floor((ndim - j) * 255 / ndim + 255 / (2 * ndim));
            colorMap[idx] = "#" + ((redValue << 16) | (greenValue << 8)).toString(16);
            idx++;
        }
    }
    return(colorMap);
}

function CreatePCAMiniplotText(ndim)
{
    var textArray = new Array(ndim * (ndim - 1) / 2);
    var idx = 0;
    for (var i = 1; i < ndim; i++) {
        for (var j = i + 1; j <= ndim; j++) {
            textArray[idx] = sprintf("$i=%d,j=%d$",i,j);
            idx++;
        }
    }
    return(textArray);

}