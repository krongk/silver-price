// Generated by CoffeeScript 1.4.0
var drawVisualization, getChartData, jsonpChartCallback, parseData, parsedGraphData;

jQuery(function($) {
  var displayQuote, getQuote;
  displayQuote = function(data) {
    var change, changePercent, current;
    current = data[2];
    change = data[3];
    changePercent = data[4];
    $("#current div.value #price").html(current);
    $("title").html("$" + current + " - Silver Price");
    if (!(changePercent.indexOf("-") >= 0)) {
      $(".change").addClass("up");
      $(".change").removeClass("down");
    } else {
      if (changePercent === "0.00") {
        $(".change").removeClass("down");
        $(".change").removeClass("up");
      } else {
        $(".change").addClass("down");
        $(".change").removeClass("up");
      }
    }
    $("#changeStock").html(change);
    return $("#changePercent").html("" + changePercent);
  };
  getQuote = function() {
    return $.ajax({
      url: "http://sp.hubuzhi.com/silverapi.php",
      success: function(data) {
        displayQuote(data);
        return $('#current').addClass('show');
      },
      error: function() {
        return $('#current').addClass('error');
      },
      dataType: "json"
    });
  };
  getQuote();
  setInterval(getQuote, 10000);
  return getChartData();
});

parsedGraphData = [];

jsonpChartCallback = function(data) {
  parseData(data);
  drawVisualization();
  $("#loader").hide();
  return $("#chart").show('100');
};

parseData = function(data) {
  parsedGraphData.push(["x", "Silver Price"]);
  if (data) {
    return $.each(data.columnValues, function(k, quote) {
      var date, myfloat, time;
      time = new Date(quote[0]);
      date = time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate();
      myfloat = parseFloat(quote[1]);
      myfloat = parseFloat(myfloat.toFixed(4));
      return parsedGraphData.push([date, myfloat]);
    });
  }
};

getChartData = function() {
  return $.ajax({
    url: "http://www.learcapital.com/charts/generated/silver_1month.json?callback=?",
    success: jsonpChartCallback,
    dataType: "jsonp"
  });
};

drawVisualization = function() {
  var data;
  data = google.visualization.arrayToDataTable(parsedGraphData);
  return new google.visualization.LineChart(document.getElementById("chart")).draw(data, {
    curveType: "function",
    width: 740,
    height: 200,
    backgroundColor: "#666",
    pointSize: 9,
    axisTitlesPosition: "none",
    lineWidth: 3,
    colors: ["#999"],
    legend: {
      position: "none"
    },
    chartArea: {
      width: "720"
    },
    animation: {
      duration: 1,
      easing: "inAndOut"
    },
    vAxis: {
      gridlines: {
        color: "#666"
      },
      textPosition: "none",
      baselineColor: "none"
    },
    hAxis: {
      textPosition: "none"
    }
  });
};

google.load("visualization", "1", {
  packages: ["corechart"]
});
