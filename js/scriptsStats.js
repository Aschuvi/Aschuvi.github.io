// var winsLoosesColors, eliminationsDeathsColors, medalsColors, barColor;
var winsLoosesColors = ["7AC402", "CB3413"];
var eliminationsDeathsColors = ["0f9ada", "141414"];
var medalsColors = ["bc8c0c", "666", "914611"];
var barColor = "e0e0e0";
var activeFilter;

var drawCharts=function(dataTable){
    var repartRole;
    
    var dataViewWinsLooses, dataViewMedals, dataViewEliminationsDeaths;
    var winsLoosesChart, medalsChart, eliminationsDeathsChart;
    var winsLoosesOptions, medalsOptions, eliminationsDeathsOptions;
    
    var dataViewPlayTimeByRole, dataViewWinsLoosesByRole, dataViewMedalsByRole;
    var winsLoosesByRChart, eliminationsDeathsByRChart, medalsByRChart;
    var winsLoosesByROptions, eliminationsDeathsByROptions, medalsByROptions;

    
	repartRole = google.visualization.data.group(dataTable, [1], [{ column:2, aggregation:google.visualization.data.sum, type:"number" }, { column:4, aggregation:google.visualization.data.sum, type:"number" }, { column:5, aggregation:google.visualization.data.sum, type:"number" }, { column:7, aggregation:google.visualization.data.avg, type:"number" }, { column:8, aggregation:google.visualization.data.avg, type:"number" }, { column:10, aggregation:google.visualization.data.avg, type:"number" }, { column:11, aggregation:google.visualization.data.avg, type:"number" }, { column:12, aggregation:google.visualization.data.avg, type:"number" }]);
    
    dataViewWinsLoosesByRole = new google.visualization.DataView(repartRole);
    dataViewWinsLoosesByRole.hideColumns([1,4,5,6,7,8]);
    
    dataViewEDByRole = new google.visualization.DataView(repartRole);
    dataViewEDByRole.hideColumns([1,2,3,6,7,8]);
    
    dataViewMedalsByRole = new google.visualization.DataView(repartRole);
    dataViewMedalsByRole.hideColumns([1,2,3,4,5]);
    
    
	dataViewWinsLooses = new google.visualization.DataView(dataTable);
	dataViewWinsLooses.hideColumns([1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    
	dataViewEliminationsDeaths = new google.visualization.DataView(dataTable);
	dataViewEliminationsDeaths.hideColumns([1, 2, 3, 4, 5, 9, 10, 11, 12, 15, 16, 17]);
    
	dataViewMedals = new google.visualization.DataView(dataTable);
	dataViewMedals.hideColumns([1, 2, 3, 4, 5, 6, 7, 8, 13, 14]);
    
    winsLoosesByROptions = { hAxis: {title: 'roles'}, seriesType: 'bars', colors: winsLoosesColors, focusTarget: 'category'};
    
    eliminationsDeathsByROptions = { hAxis: {title: 'roles'}, seriesType: 'bars', colors: eliminationsDeathsColors, focusTarget: 'category'};
    
    medalsByROptions = { hAxis: {title: 'roles'}, seriesType: 'bars', colors: medalsColors, focusTarget: 'category' };
    
    
    
    winsLoosesChart = new google.visualization.ComboChart(document.getElementById('winLooseChartArea'));
    winsLoosesOptions = { hAxis: {title: 'heroes', textStyle: { fontSize: 11}}, seriesType: 'bars', colors: winsLoosesColors, focusTarget: 'category', tooltip: { isHtml: true }};
    
    eliminationsDeathsChart = new google.visualization.ComboChart(document.getElementById('eliminationsDeathsChartArea'));
    eliminationsDeathsOptions = { hAxis: {title: 'heroes', textStyle: { fontSize: 11}}, seriesType: 'bars', series: {2: {type: 'line', lineWidth: 1},3: {type: 'line', lineWidth: 1}}, colors: eliminationsDeathsColors, focusTarget: 'category', tooltip: { isHtml: true }};
    
    medalsChart = new google.visualization.ComboChart(document.getElementById('medalsChartArea'));
    medalsOptions = { hAxis: {title: 'heroes'}, seriesType: 'bars', series: {3: {type: 'line', lineWidth: 1},4: {type: 'line', lineWidth: 1},5: {type: 'line', lineWidth: 1}}, colors: medalsColors, focusTarget: 'category', tooltip: { isHtml: true }};
    
	function displayCharts(){
        if ((window.location.href).split("#")[1] == "roles") {
            winsLoosesChart.draw(dataViewWinsLoosesByRole, winsLoosesByROptions);
            eliminationsDeathsChart.draw(dataViewEDByRole, eliminationsDeathsByROptions);
            medalsChart.draw(dataViewMedalsByRole, medalsByROptions);
            $("#rolesFilters").hide();
        } else {
            winsLoosesChart.draw(dataViewWinsLooses, winsLoosesOptions);
            medalsChart.draw(dataViewMedals, medalsOptions);
            eliminationsDeathsChart.draw(dataViewEliminationsDeaths, eliminationsDeathsOptions);
        }
	} 
    
	$("#statsByHeroes").click(function(){
        winsLoosesChart.draw(dataViewWinsLooses, winsLoosesOptions);
        medalsChart.draw(dataViewMedals, medalsOptions);
        eliminationsDeathsChart.draw(dataViewEliminationsDeaths, eliminationsDeathsOptions);
        $("#rolesFilters").show();
    });
    
	$("#statsByRoles").click(function(){
        winsLoosesChart.draw(dataViewWinsLoosesByRole, winsLoosesByROptions);
        eliminationsDeathsChart.draw(dataViewEDByRole, eliminationsDeathsByROptions);
        medalsChart.draw(dataViewMedalsByRole, medalsByROptions);
        $("#rolesFilters").hide();
    });
    
	displayCharts();
    
    $(".rolesFilter").click(function(){
        console.log("test");
        var filterValue = $(this).data("ow-roles-filter"), filterDataTable;
        console.log(filterValue);
        if(filterValue != "all") {
            console.log(activeFilter);
            activeFilter = filterValue;
            
            var filteredDataTableWL = new google.visualization.DataView(dataViewWinsLooses);
            filteredDataTableWL.setRows(dataTable.getFilteredRows([{column: 1, value: filterValue}]));
            
            var filteredDataTableED = new google.visualization.DataView(dataViewEliminationsDeaths);
            filteredDataTableED.setRows(dataTable.getFilteredRows([{column: 1, value: filterValue}]));
            
            var filteredDataTableM = new google.visualization.DataView(dataViewMedals);
            filteredDataTableM.setRows(dataTable.getFilteredRows([{column: 1, value: filterValue}]));
            
            console.log("pass");
            winsLoosesChart.draw(filteredDataTableWL, winsLoosesOptions);
            eliminationsDeathsChart.draw(filteredDataTableED, eliminationsDeathsOptions);
            medalsChart.draw(filteredDataTableM, medalsOptions);
        } else {
            winsLoosesChart.draw(dataViewWinsLooses, winsLoosesOptions);
            eliminationsDeathsChart.draw(dataViewEliminationsDeaths, eliminationsDeathsOptions);
            medalsChart.draw(dataViewMedals, medalsOptions);
        }
        console.log("finish");
    });
    
    // met la selection sur les autres graphiques
	function setSelection(selectedRow){
		if(selectedRow!==undefined){
			winsLoosesChart.setSelection([{row:selectedRow,column:null}]);
			eliminationsDeathsChart.setSelection([{row:selectedRow,column:2},{row:selectedRow,column:3}]);
			medalsChart.setSelection([{row:selectedRow,column:2},{row:selectedRow,column:3},{row:selectedRow,column:4}])
		}
		else{
			winsLoosesChart.setSelection([]);
			eliminationsDeathsChart.setSelection([]);
			medalsChart.setSelection([])
		}
	}
    
    // events pour la selection sur les autres graphiques
	google.visualization.events.addListener(winsLoosesChart, "select", function (){
		var selection=winsLoosesChart.getSelection()[0];
		if(selection){
			setSelection(selection.row)
		}else{
			setSelection()
		}
	});
	google.visualization.events.addListener(eliminationsDeathsChart, "select", function (){
		var selection=eliminationsDeathsChart.getSelection()[0];
		if(selection){
			setSelection(selection.row)
		}else{
			setSelection()
		}
	});
	google.visualization.events.addListener(medalsChart, "select", function (){
		var selection=medalsChart.getSelection()[0];
		if(selection){
			setSelection(selection.row)
		}
		else{
			setSelection()
		}
	});
};

var tooltipWinLoose = function(d,i) {
    return '<div style="width: 150px;">'+
        '<img src="img/heroes/'+i+'.png" style="width:30px; float: left; margin: 5px 10px 5px 5px">'+
        '<table class="tooltip_layout" style="float: left; width: 100px">' + 
            '<tr>' +
                '<th colspan="2">'+'<b style="text-transform: uppercase">'+ d.nom[i] +'</b>'+'</th>' +
            '</tr>' + 
            '<tr style="color: #' + winsLoosesColors[0] + '">' +
                '<td><b>Wins</b></td>' +
                '<td>'+ d.wins[i] +'</td>' +
            '</tr>' + 
            '<tr style="color: #' + winsLoosesColors[1] + '">' +
                '<td><b>Looses</b></td>' +
                '<td>'+ d.looses[i] + '</td>' +
            '</tr>' +
        '</table>' +
    '</div>';
}

var tooltipED = function(d,i) {
    return '<div style="width: 250px;">'+
        '<img src="img/heroes/'+i+'.png" style="width:30px; float: left; margin: 5px 10px 5px 5px">'+
        '<table class="tooltip_layout" style="float: left; width: 200px">' + 
            '<tr>' +
                '<th>'+'<b style="text-transform: uppercase">'+ d.nom[i] +'</b>'+'</th>' +
                '<th>Per Game</th>' + 
                '<th>Overall</th>' + 
            '</tr>' +
            '<tr style="color: #' + eliminationsDeathsColors[0] + '">' +
                '<td><b>Eliminations</b></td>' +
                '<td>'+ (d.eliminations[i]/(d.wins[i] + d.looses[i])).toFixed(2) +'</td>' + 
                '<td>'+ d.eliminations[i] +'</td>' + 
            '</tr>' + 
            '<tr style="color: #' + eliminationsDeathsColors[1] + '">' +
                '<td><b>Deaths</b></td>' +
                '<td>'+ (d.deaths[i]/(d.wins[i] + d.looses[i])).toFixed(2)+'</td>' + 
                '<td>'+ d.deaths[i] +'</td>' +  
            '</tr>' +
        '</table>' +
    '</div>';
}

var tooltipMedals = function(d,i) {
    var totalGames = d.wins[i] + d.looses[i];
    return '<div style="width: 250px;">'+
        '<img src="img/heroes/'+i+'.png" style="width:30px; float: left; margin: 5px 10px 5px 5px">'+
        '<table class="tooltip_layout" style="float: left; width: 200px">' + 
            '<tr>' +
                '<th>'+'<b style="text-transform: uppercase">'+ d.nom[i] +'</b>'+'</th>' +
                '<th>Per Game</th>' + 
                '<th>Overall</th>' + 
            '</tr>' +
            '<tr style="color: #' + medalsColors[0] + '">' +
                '<td><b>Gold</b></td>' +
                '<td>'+ (d.gold[i]/totalGames).toFixed(2) +'</td>' + 
                '<td>'+ d.gold[i] +'</td>' + 
            '</tr>' + 
            '<tr style="color: #' + medalsColors[1] + '">' +
                '<td><b>Silver</b></td>' +
                '<td>'+ (d.silver[i]/totalGames).toFixed(2)+'</td>' + 
                '<td>'+ d.silver[i] +'</td>' +  
            '</tr>' +
            '<tr style="color: #' + medalsColors[2] + '">' +
                '<td><b>Bronze</b></td>' +
                '<td>'+ (d.bronze[i]/totalGames).toFixed(2)+'</td>' + 
                '<td>'+ d.bronze[i] +'</td>' +  
            '</tr>' +
        '</table>' +
    '</div>';
}

function initialization(){    
    // récupération du fichier JSON
	$.getJSON("ressources/datas.json")
        .done(function(d){
        // création de la DataTable pour google Chart si les données sont cohérantes
        if(d.nom.length != d.role.length || d.role.length != d.looses.length || d.role.length != d.time.length || d.looses.length != d.wins.length || d.wins.length != d.eliminations.length || d.eliminations.length != d.deaths.length || d.deaths.length != d.gold.length || d.gold.length != d.silver.length || d.silver.length != d.bronze.length) {
            $("#container").prepend("<div class='alert alert-danger' role='alert'><strong>Data file corrupted</strong></div>");
        } else {
            var dataTable=new google.visualization.DataTable();

            dataTable.addColumn("string","Name");
            dataTable.addColumn("string","Role");
            dataTable.addColumn("number","Play Time");
            
            // tootip for the Wins/Looses chart
            dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
            dataTable.addColumn("number","Wins");
            dataTable.addColumn("number","Looses");
            
            // tootip for the Eliminations/Deaths chart
            dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
            dataTable.addColumn("number","Kills By Game");
            dataTable.addColumn("number","Deaths By Game");
            
            // tootip for the Medals chart
            dataTable.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
            dataTable.addColumn("number","Gold Medals By Game");
            dataTable.addColumn("number","Silver Medals By Game");
            dataTable.addColumn("number","Bronze Medals By Game");
            
            dataTable.addColumn("number", "AVG Kills");
            dataTable.addColumn("number", "AVG Deaths");
            dataTable.addColumn("number", "AVG Gold Medals");
            dataTable.addColumn("number", "AVG Silver Medals");
            dataTable.addColumn("number", "AVG Bronze Medals");
            
            var AVGkills=0, AVGdeath=0, AVGgold=0, AVGsilver=0, AVGbronze=0, nbGamesTot=0;
            
            // calcul des moyennes
            d.nom.forEach(function(nom, i) {
                AVGkills+=d.eliminations[i];
                AVGdeath+=d.deaths[i];
                AVGgold+=d.gold[i];
                AVGsilver+=d.silver[i];
                AVGbronze+=d.bronze[i];
                nbGamesTot+=d.wins[i] + d.looses[i];
            });
            
            AVGkills = AVGkills/nbGamesTot;
            AVGdeath = AVGdeath/nbGamesTot;
            AVGgold = AVGgold/nbGamesTot;
            AVGsilver = AVGsilver/nbGamesTot;
            AVGbronze = AVGbronze/nbGamesTot;
            
            var nbGames;
            d.nom.forEach(function(nom, i){
                nbGames = d.wins[i] + d.looses[i];
                // chargement des valeurs depuis le JSON
                dataTable.addRows([[nom, d.role[i], d.time[i], tooltipWinLoose(d,i), d.wins[i], d.looses[i], tooltipED(d,i), (d.eliminations[i]/nbGames), (d.deaths[i]/nbGames), tooltipMedals(d,i), (d.gold[i]/nbGames), (d.silver[i]/nbGames), (d.bronze[i]/nbGames), AVGkills, AVGdeath, AVGgold, AVGsilver, AVGbronze]]);
            });
            
            // console.log(dataTable.getValue(0,0));
            drawCharts(dataTable);
        }
	});

};