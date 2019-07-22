var labels = [];
var dataset = [];
$(document).ready(async function () {
    var temperatures;
    var ctx = document.getElementById('myChart').getContext('2d');
    //var config = {
//    type: 'line',
//    data: {
//        labels: labels,
//        datasets: [{
//            label: 'Graph Line',
//            data: data,
//            backgroundColor: 'rgba(0, 119, 204, 0.3)'
//        }]
//    }
//};

//var chart = new Chart(ctx, config);
    ///////////////////////
    var mainobj;
    getValues();
    //chart();
    function chart(etiquetas,datos) {
        console.log("chart");

        var myLineChart =new Chart(ctx, {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Temperaturas',
                    data: datos,
                    backgroundColor: "rgba(153,255,51,0.4)"
                }]
                //labels: etiquetas ,
                //datsets: [{
                //    label: 'Temperaturas',
                //    data: [29, 30],
                //    backgroundColor: "rgba(153,255,51,0.4)"
                    
                //}]
            }, options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        });
        filltable(etiquetas,datos);
    }
    
    
    

      async function getValues() {
        var obj = $.parseJSON($("#city").children("option:selected").val());
        
        mainobj = [{

            "lat": obj.lat,
            "lon": obj.lon,
            "units": $("#scale").children("option:selected").val(),
            "key": "cb33c498421d45c6adbbbeb578e7e67b",//"d6fad149bbf845ab936ec8d21ff7a7af",
            "start_date": moment().subtract(1, 'days').format('YYYY-MM-DD'),
            "end_date": moment().format('YYYY-MM-DD')

        }]   
          await callAPI(mainobj);
         
    }
    $("#city").change(function () {
        getValues();
    });
    $("#scale").change(function () {
        getValues();
    });

    async function callAPI(mainobj) {
        //https://api.weatherbit.io/v2.0/history/daily?lat=27.07&lon=-109.4437&start_date=2019-07-07&end_date=2019-07-08&units=I&key=d6fad149bbf845ab936ec8d21ff7a7af
        
        labels.length = 0;
        dataset.length = 0;
        for (let i = 0; i < 15; i++) {
            mainobj[0].start_date = moment().subtract(i + 1, 'days').format('YYYY-MM-DD');
            mainobj[0].end_date = moment().subtract(i, 'days').format('YYYY-MM-DD');
            var weatherApi = "https://api.weatherbit.io/v2.0/history/daily?lat=" + mainobj[0].lat + "&lon=" + mainobj[0].lon + "&start_date=" + mainobj[0].start_date + "&end_date=" + mainobj[0].end_date + "&units=" + mainobj[0].units + "&key=" + mainobj[0].key + "";
            await $.ajax({

                dataType: "json",
                url: weatherApi,
                data: mainobj[0],
                success: async function (data) {
                    //var dia = {
                    //    "temp": data["data"][0].temp,
                    //    "datetime": data["data"][0].datetime
                    //}
                    await labels.push(data["data"][0].datetime);
                    await dataset.push(data["data"][0].temp);
                    
                },
                error: function (request, error) {
                    console.log("Request: " + JSON.stringify(request));
                }
            }); 
        }
        chart(labels, dataset);
        
        
    }

    function filltable(etiquetas,datos) {
        var tabla = [];
        let i;
        for (i = 0; i < etiquetas.length; i++) {
            tabla.push({
                "datetime": etiquetas[i],
                "temperature": datos[i]
            });
        }
        var $table = $('#table')
        $table.bootstrapTable({ data: tabla })
        $table.bootstrapTable('load', tabla);
        
    }
});