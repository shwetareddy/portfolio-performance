(function($) {

	$(document).ready(function() {
    var portfolioSelectContainer = $("#portfolio-select");
    var returnsContainer = $("#cumulative-returns");
    var portfoliosUrl = "/api/portfolios";
    var chart = performanceChart({ 
        svg: '#chart svg',
        startDate: '#fromdate',
        endDate: '#todate'
    });

    returnsContainer.hide();

    var portfoliosPromise = $.ajax({
        type: "GET",
        url: portfoliosUrl,
        dataType: 'json', 
        contentType: 'application/json; charset=UTF-8'
    });

    portfoliosPromise.done(function(data) {
      _.each(data, function(portfolio) {
        var checkbox = $('<input type="checkbox" value="' + portfolio.id + '" name="' + portfolio.name +'"/><label> ' + portfolio.name + '</label></br>');
        portfolioSelectContainer.append(checkbox);
      });
    });

    $('#report-submit').on("click", function() {
      var checkboxes = $('#portfolio-select input[type="checkbox"]');
      var seriesDataPromise = chart.loadData(checkboxes);
      var returnsDataPromise = chart.loadReturns(checkboxes);

      seriesDataPromise.done(function(seriesData) {
        chart.showData(seriesData);
      });

      returnsDataPromise.done(function(returnsData) {
        displayReturnsData(returnsData);
      });
    });

    function displayReturnsData(data) {
      var tbody = returnsContainer.find("tbody");
      if (data.length) {
        returnsContainer.show();
        tbody.html('<tr><td>Benchmark</td><td>' + data[0].benchmark.toFixed(2) + '</td></tr>');
      }
      else {
        returnsContainer.hide();
      }
      
      _.each(data, function(returns) {
        var row = $('<tr><td>' + returns.name + '</td><td>' + returns.portfolio.toFixed(2) + '</td></tr>');
        returnsContainer.append(row);
      });

    }

  });
})(jQuery);