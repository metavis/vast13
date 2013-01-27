/**
 * Created with JetBrains WebStorm.
 * User: ziyuan
 * Date: 13-1-27
 * Time: 上午2:30
 * To change this template use File | Settings | File Templates.
 */

var SVGSize = 700;
var CircleRadius = 3;

var MarginMainPlot = 10;
var ScaleMainPlot = d3.scale.linear()
    .domain([0, 1])
    .range([MarginMainPlot, SVGSize - MarginMainPlot]);

var CircleIdPrefixPCA = "pca_circ_";
var MiniplotSize = 100;
var MiniplotIdPrefixPCA = "pca_mini_";

var FaceSize = 15;

var LargerMiniplotSize = 350;

var MarginLargerMiniplot = FaceSize + 2;
var ScaleLargerMiniplot = d3.scale.linear()
    .domain([0, 1])
    .range([MarginLargerMiniplot, LargerMiniplotSize - MarginLargerMiniplot]);

var ColorMapPCA = CreateColorMapPCA(40);
var MiniplotTextPCA = CreateMiniplotTextPCA(40);


$(function () {
    ShowMainPlot("#plot_pca", "data/nerv_pca.json", "data/views_pca", "data/faces");
    CreateImageDivs("#miniplot_group_pca", "data/views_pca", 780, MiniplotIdPrefixPCA, MiniplotSize, MiniplotTextPCA);
});

function ShowMainPlot(divId, jsonFileName, viewFolder, faceFolder) {
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

    d3.json(jsonFileName, function (json) {

        svg.selectAll("circle")
            .data(json)
            .enter()
            .append("circle")
            .attr("id", function (d, i) {
                var idx = sprintf("%03d", i + 1);
                return(CircleIdPrefixPCA + idx);
            })
            .attr("cx", function (d) {
                return(ScaleMainPlot(d[0]));
            })
            .attr("cy", function (d) {
                return(ScaleMainPlot(1-d[1]));
            })
            .attr("r", CircleRadius)
            .attr("fill", function (d, i) {
                return(ColorMapPCA[i]);
            })
            .on("mouseover", function (d, i) {
                var x = d3.mouse(this)[0];
                var y = d3.mouse(this)[1];
                var miniplot = sprintf("#%s%03d", MiniplotIdPrefixPCA, i);
                d3.select(miniplot)
                    .style("top", y + "px")
                    .style("left", x + "px")
                    .style("display", "block");


                var larger_miniplot = d3.select("#larger_miniplot_pca");
                larger_miniplot.select("p")
                    .style("text-align", "center")
                    .text(MiniplotTextPCA[i]);
                var larger_miniplot_svg = larger_miniplot.select("svg");
                larger_miniplot_svg.remove();
                larger_miniplot_svg = larger_miniplot.append("svg");
                larger_miniplot_svg.attr("width", LargerMiniplotSize)
                    .attr("height", LargerMiniplotSize)
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", LargerMiniplotSize)
                    .attr("height", LargerMiniplotSize)
                    .attr("fill", "none")
                    .attr("stroke-width", 2)
                    .attr("stroke", "black");

                var viewJsonFileName = sprintf("%s/%03d.json", viewFolder, i);

                d3.json(viewJsonFileName, function (viewJson) {
                    larger_miniplot_svg.selectAll("image")
                        .data(viewJson)
                        .enter()
                        .append("image")
                        .attr("x", function (view_d, view_i) {
                            return(ScaleLargerMiniplot(view_d[0]));
                        })
                        .attr("y", function (view_d, view_i) {
                            return(ScaleLargerMiniplot(1-view_d[1]));
                        })
                        .attr("width", FaceSize)
                        .attr("height", FaceSize)
                        .attr("xlink:href", function (view_d, view_i) {
                            return(sprintf("%s/%03d.png", faceFolder, view_i + 1));
                        });

                });
            })
            .on("mouseout", function (d, i) {
                var miniplot = sprintf("#%s%03d", MiniplotIdPrefixPCA, i);
                d3.select(miniplot)
                    .style("display", "none");
            });
    });
}

function CreateImageDivs(containerId, folder, count, divIdPrefix, size, additionalTexts) {
    for (var i = 1; i <= count; i++) {
        var img_path = sprintf("%s/%03d.png", folder, i);
        var div_id = sprintf("%s%03d", divIdPrefix, i);
        var img_div = d3.select(containerId).append("div");
        img_div.attr("id", div_id)
            .style("width", size + "px")
            .style("height", size + "px")
            .style("position", "absolute")
            .style("display", "none")
            .append("img")
            .attr("src", img_path);

        if (additionalTexts != null) {
            img_div.append("p")
                .style("text-align", "center")
                .style("background-color", "white")
                .append("small")
                .text(additionalTexts[i]);
        }
    }
}

function CreateColorMapPCA(ndim) {
    var colorMap = new Array(ndim * (ndim - 1) / 2);
    var idx = 0;
    for (var i = 1; i < ndim; i++) {
        var greenValue = Math.floor((ndim - i) * 255 / ndim + 255 / (2 * ndim));
        for (var j = i + 1; j <= ndim; j++) {
            var redValue = Math.floor((ndim - j) * 255 / ndim + 255 / (2 * ndim));
            colorMap[idx] = sprintf("#%06x", (redValue << 16) | (greenValue << 8));
            idx++;
        }
    }
    return(colorMap);
}

function CreateMiniplotTextPCA(ndim) {
    var textArray = new Array(ndim * (ndim - 1) / 2);
    var idx = 0;
    for (var i = 1; i < ndim; i++) {
        for (var j = i + 1; j <= ndim; j++) {
            textArray[idx] = sprintf("i=%d, j=%d", i, j);
            idx++;
        }
    }
    return(textArray);
}