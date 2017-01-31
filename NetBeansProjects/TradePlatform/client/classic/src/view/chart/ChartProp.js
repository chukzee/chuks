/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var tooltip = {
    trackMouse: true,
    width: 190,
    height: 140,
    renderer: function (storeItem, item) {

        storeItem.update(
                "<table><tr><td>Open</td><td>:  " + item.get('open') + "</td></tr>"
                + "<tr><td>High</td><td>:  " + item.get('high') + "</td></tr>"
                + "<tr><td>Low</td><td>:  " + item.get('low') + "</td></tr>"
                + "<tr><td>Close</td><td>:  " + item.get('close') + "</td></tr>"
                + "<tr><td>Date</td><td>:  " + new Date(item.get('time')).toDateString() + "</td>"
                + "<tr><td>Time</td><td>:  " + new Date(item.get('time')).toTimeString().substring(0, 17) + "</td>"
                + "</tr></table>"
                );
    }
};

Ext.define('TradeApp.view.chart.ChartProp', {
    config: {
        needHighPrecision: false,
        selectedChartType: null,
        axes: [
            {
                grid: true,
                type: 'numeric',
                fields: ['open', 'high', 'low', 'close'],
                position: 'right',
                renderer: function (storeItem, item) {
                    /*if (storeItem == 85)
                     return 'Elite';
                     else if (storeItem == 70)
                     return 'Excellent';
                     else if (storeItem == 50)
                     return 'Approved';
                     else
                     return ''*/
                    //console.log(item);
                    return new Number(item).toFixed(5);
                }
                //maximum: 0,
                //minimum: 0
            },
            {
                grid: true,
                type: 'time',
                fields: ['time'],
                position: 'bottom'
                        //dateFormat: 'd-M', // does not allow the crosshair label to display properly - bottom part is obscured. I do not know why.
                        //fromDate: new Date('Jan 01 2010'),
                        // toDate: new Date('Jan 04 2010'),
                        //step: [Ext.Date.HOUR, 1]
                        //title: 'Time',
                        //visibleRange: [0.9, 1]
                        //visibleRange: 50 WORKING IN THIS CASE
            }
        ],
        candleStick: {
            type: 'candlestick',
            xField: 'time',
            openField: 'open',
            highField: 'high',
            lowField: 'low',
            closeField: 'close',
            tips: tooltip,
            style: {
                barWidth: 3,
                opacity: 0.7,
                dropStyle: {
                    fill: 'rgb(237,123,43)',
                    stroke: 'rgb(237,123,43)'
                },
                raiseStyle: {
                    fill: 'rgb(55,153,19)',
                    stroke: 'rgb(55,153,19)'
                }
            }
        },
        ohlc: {
            type: 'candlestick', //yes candlestick but the style below is set to ohlc
            xField: 'time',
            openField: 'open',
            highField: 'high',
            lowField: 'low',
            closeField: 'close',
            tips: tooltip,
            style: {
                ohlcType: 'ohlc',
                barWidth: 3,
                opacity: 0.7,
                dropStyle: {
                    fill: 'rgb(237,123,43)',
                    stroke: 'rgb(237,123,43)'
                },
                raiseStyle: {
                    fill: 'rgb(55,153,19)',
                    stroke: 'rgb(55,153,19)'
                }
            }
        },
        line: {
            type: 'line',
            xField: 'time',
            yField: 'close',
            tips: tooltip,
            style: {
                lineWidth: 2
            },
            label: {
                display:'chuksman',
                renderer: function (text, sprite, config, rendererData, index) {
                    console.log("label");
                }
            },
            highlight: {
                fillStyle: '#000',
                radius: 5,
                lineWidth: 2,
                strokeStyle: '#fff'
            }/*,
             tooltip: {
             trackMouse: true,
             showDelay: 0,
             dismissDelay: 0,
             hideDelay: 0,
             renderer: 'onSeriesTooltipRender'
             }*/
        },
        area: {
            type: 'area',
            //title: title,
            xField: 'time',
            yField: 'close',
            tips: tooltip,
            style: {
                opacity: 0.60
            },
            /*marker: {
             opacity: 0,
             scaling: 0.01,
             fx: {
             duration: 200,
             easing: 'easeOut'
             }
             },*/
            highlightCfg: {
                opacity: 1,
                scaling: 1.5
            }
            /*tooltip: {
             trackMouse: true,
             renderer: function (tooltip, record, item) {
             tooltip.setHtml(title + ' (' + record.get('year') + '): ' + record.get(field));
             }
             }*/
        },
        priceLine: {
            type: 'line',
            xField: 'time',
            yField: 'pl_price',
            style: {
                lineWidth: 2 // try say 1.5 later
            },
            markerConfig: {
                type: 'circle',
                size: 0,
                radius: 0,
                'stroke-width': 0,
                fill: '#1F3462',
                stroke: '#1F3462'
            },
            highlight: {
                fillStyle: '#000',
                radius: 2,
                lineWidth: 1,
                strokeStyle: '#fff'
            }
        }
    },
    constructor: function (config) {
        this.initConfig(config);
    }

});


