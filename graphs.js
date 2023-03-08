stack
###############

function convertToInternationalCurrencySystem (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}

$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        exporting: {
        	enabled: false,
        },
        xAxis: {
            categories: ['JPM', 'Citi']
        },
        yAxis: {
            //min: 0,
            title: {
                text: 'Total fruit consumption'
            },
            stackLabels: {
                enabled: false,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + convertToInternationalCurrencySystem(this.y) + '<br/>';
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black, 0 0 3px black'
                    }, formatter: function () {
                return convertToInternationalCurrencySystem(this.y);
            }
                }
            }
        },
        colors: ['#077D55', '#82ca9d'],
        series: [{
            name: 'Total Earnings',
            data: [560031, 1910694]
        },{
            name: 'Total Expenses',
            data: [-1142066, -1274131]
        }]
    });
});





pie chart
###############


function convert(labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue));

}

// Data retrieved from https://netmarketshare.com
Highcharts.chart('container', {
    chart: {
plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
        exporting: {
        	enabled: false,
        },
    title: {
        text: '',
    },
tooltip: {
    formatter: function() {
      return "Total Expense </br>" + this.point.name + ': <b>$' + convert(this.y) + '</b>';
    }
  },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
/*                 format: '<b>{point.name}: $</b>{point.y}' */
                formatter: function() {
                	return this.point.name + ': $'+ convert(this.y);
                }
            }
        }
    },
    colors: ['#1C315E', '#227C70', '#88A47C', '#A9AF7E', '#63A1D0'],
    series: [{
        name: 'Total Expense',
        colorByPoint: true,
        data: [{
            name: 'Balance Based Charges',
            y: 1746442.08,
            sliced: true,
            selected: true
        }, {
            name: 'Wire Services',
            y: 585887.16
        },  {
            name: 'Account Services',
            y: 41384.56
        }, {
            name: 'Miscellaneous',
            y: 40008.24
        }, {
            name: 'Disbursement Services',
            y: 36223.24
        }]
    }]
});
