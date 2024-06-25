function calculateAndDisplaySummary(selectedYear) {
  // Initialize objects to store counts for each category
  let trafficCounts = {};
  let theftCounts = {};

  // Function to count records by year for traffic accidents
  function countTrafficAccidentsByYear(data) {
    data.forEach(record => {
      let year = record.YEAR;
      if (year in trafficCounts) {
        trafficCounts[year] += 1;
      } else {
        trafficCounts[year] = 1;
      }
    });
  }

  // Function to count records by year for thefts
  function countTheftsByYear(data) {
    data.forEach(record => {
      let year = record.YEAR;
      if (year in theftCounts) {
        theftCounts[year] += 1;
      } else {
        theftCounts[year] = 1;
      }
    });
  }

  // Load traffic accidents data
  d3.json('Resources/traffic_accidents_data.json')
    .then(trafficData => {
      // Count records for traffic accidents by year
      countTrafficAccidentsByYear(trafficData);

      // Load theft data
      d3.json('Resources/theft_data.json')
        .then(theftData => {
          // Count records for thefts by year
          countTheftsByYear(theftData);

          // Initialize totals
          let totalTrafficAccidents = 0;
          let totalThefts = 0;

          // If a specific year is selected, calculate totals for that year
          if (selectedYear) {
            totalTrafficAccidents = trafficCounts[selectedYear] || 0;
            totalThefts = theftCounts[selectedYear] || 0;
          } 
        

          // Select the panel to display the combined summary
          let panel = d3.select("#summary-panel");

          // Clear any existing content
          panel.html("");

          // Append summary for total traffic accidents
          panel.append("p").text(`Total Traffic Accidents: ${totalTrafficAccidents}`);
          
          // Append summary for total thefts
          panel.append("p").text(`Total Thefts: ${totalThefts}`);

         

        }).
        catch(error => {
          console.error('Error loading theft_data.json:', error);
          // Display an error message in the panel
           d3.select("#summary-panel").html("<p>Error loading data.</p>");
         });

    })

}
// Function to create a pie chart showing accidents by age using Chart.js
function AccidentsByAgePieChart(year) {
  // Load the JSON data for accidents
  d3.json('Resources/traffic_accidents_data.json').then(data => {
// Convert year to number (assuming 'year' is already a number in your context)
year = +year;

// Filter the data for the specified year
let dataForYear = data.filter(d => d.YEAR === year);

// Filter out data where age is unknown or not specified
dataForYear = dataForYear.filter(d => d.INVAGE !== null && d.INVAGE !== undefined && d.INVAGE !== '');

// Define age categories 
let ageCategories = {
  "0 to 4": "< 20",
  "5 to 9": "< 20",
  "10 to 14": "< 20",
  "15 to 19": "< 20",
  "20 to 24": "20-29",
  "25 to 29": "20-29",
  "30 to 34": "30-39",
  "35 to 39": "30-39",
  "40 to 44": "40-49",
  "45 to 49": "40-49",
  "50 to 54": "50-59",
  "55 to 59": "50-59",
  "60 to 64": "60-69",
  "65 to 69": "60-69",
  "70 to 74": "70+",
  "75 to 79": "70+",
  "80 to 84": "70+",
  "85 to 89": "70+",
  "90 to 94": "70+",
  "Over 95": "70+",
  "unknown": "Unknown"
};

// Group the data by age category and count occurrences
let accidentCountByAgeCategory = d3.rollup(
  dataForYear,
  v => v.length,
  d => {
    let ageRange = d.INVAGE;
    return ageCategories[ageRange] || "Unknown";
  }
);

// Extract labels and data for the chart
let orderedLabels = ["< 20", "20-29", "30-39", "40-49", "50-59", "60-69", "70+", "Unknown"];

let labels = orderedLabels.filter(label => accidentCountByAgeCategory.get(label) !== undefined);
let dataCounts = labels.map(label => accidentCountByAgeCategory.get(label));

    // Define colors for each category 
    let colors = [
      '#FF6384', 
      '#36A2EB',
      '#FFCE56', 
      '#4BC0C0', 
      '#9966FF', 
      '#FF8C00', 
      '#008000',
      '#7C7C7C'
        ];

    // Chart.js configuration
    let config = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataCounts,
          backgroundColor: colors.slice(0, labels.length), 
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 2, 
        maintainAspectRatio: true,
        plugins: {
        title: {
          display: true,
          text: `Involved Party in Accidents by Age Group in ${year}`,
          font: {
            size: 20},
            padding: 20
        },
          legend: {
            position: 'top',
            labels: {
              // Generate legend items
              generateLabels: function(chart) {
                let labels = chart.data.labels;
                let datasets = chart.data.datasets;
                let legendItems = labels.map((label, i) => {
                  return {
                    text: label,
                    fillStyle: datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  };
                });

                // Arrange the order of legend items
                legendItems.sort((a, b) => {
                  let order = {
                    "< 20": 0,
                    "20-29": 1,
                    "30-39": 2,
                    "40-49": 3,
                    "50-59": 4,
                    "60-69": 5,
                    "70+": 6,
                    "Unknown": 7
                  };
                });

                 return legendItems;
              },
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    };

        // Get canvas element
        let canvas = document.getElementById('accidentsByAgeChart');
        let ctx = canvas.getContext('2d');

        // Destroy previous chart instance if it exists
        if (window.myPieChart) {
            window.myPieChart.destroy();
        }

        // Clear the canvas before creating a new chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create the new chart
        window.myPieChart = new Chart(ctx, config);
    });

}


function Accidentgraph(year) {
  d3.json('Resources/traffic_accidents_data.json').then((data) => {
      // Convert year to number
      year = +year;
      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);
      // Group the data by neighborhood and count the occurrences
      let accidentCountByNeighborhood = d3.rollup(
        dataForYear,
        v => v.length,
        d => d.NEIGHBOURHOOD_158
      );
      // Sort the neighborhoods by accident count in descending order and get the top 10
      let topNeighborhoods = Array.from(accidentCountByNeighborhood)

        .sort((a, b) => b[1] - a[1]) // Sort in descending order by count
        .slice(0, 10); // Get the top 10 neighborhoods
      // Extract the neighborhood names and counts for the chart
      let neighborhoods = topNeighborhoods.map(d => d[0]);
      let accidentCounts = topNeighborhoods.map(d => d[1]);
      

      // Create a bar chart using Plotly
      let trace = {
        x: neighborhoods,
        y: accidentCounts ,
        type: 'bar'
      };
      let layout = {
        //width: 500,  
        height: 500,
        title: `Top 10 Neighborhoods with highest # Accidents in ${year}`,
        yaxis: { title: '# of Accidents', tickfont: {size:10}},
      };
      Plotly.newPlot('bar2', [trace], layout);
  });
}
function Theftgraph(year) {
  d3.json('Resources/theft_data.json').then((data) => {
      // Convert year to number
      year = +year;
      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);
      // Group the data by neighborhood and count the occurrences
      let theftCountByNeighborhood = d3.rollup(
        dataForYear,
        v => v.length,
        d => d.NEIGHBOURHOOD_158
      );
      // Sort the neighborhoods by theft count in descending order and get the top 10
      let topNeighborhoods = Array.from(theftCountByNeighborhood)
        .sort((a, b) => b[1] - a[1]) // Sort in descending order by count
        .slice(0, 10); // Get the top 10 neighborhoods
      // Extract the neighborhood names and counts for the chart
      let neighborhoods = topNeighborhoods.map(d => d[0]);
      let theftCounts = topNeighborhoods.map(d => d[1]);
      // Create a bar chart using Plotly
      let trace = {
        x: neighborhoods,
        y: theftCounts,
        type: 'bar'
      };
      let layout = {
        //width: 500,  // Adjust width as needed
        height: 600,
        margin: { t: 200, l: 50, r: 50,},
        title: `Top 10 Neighborhoods with highest # of Thefts in ${year}`,
        yaxis: { title: '# of thefts' }
      };
      Plotly.newPlot('bar1', [trace], layout);
  });
}


// Function to run on page load
function init() {
      // Create an array of years from 2018 to 2023
      let years = Array.from({length: 6}, (_, index) => 2018 + index);
    
      // Select the dropdown element
      let dropdown = d3.select("#selDataset");
    
      // Populate the dropdown with the years
      years.forEach(year => {
        dropdown.append("option")
          .text(year)
          .attr("value", year);
      });
    
      // Get the first year (2018) from the list
      let firstYear = years[0];
    
      // Build charts and metadata panel with the first year
      calculateAndDisplaySummary(firstYear);
      Theftgraph(firstYear);
      Accidentgraph(firstYear);
      googleChart(firstYear);
      plotlyScatter(firstYear);
      leafletmap(firstYear);
      AccidentsByAgePieChart(firstYear);


     
    //Update the optionChanged function to handle the selection of a new year:
    function optionChanged(newYear) {
      // Build charts and metadata panel each time a new year is selected
      calculateAndDisplaySummary(newYear);
      Theftgraph(newYear);
      Accidentgraph(newYear);
      googleChart(newYear);
      plotlyScatter(newYear);
      leafletmap(newYear);
      AccidentsByAgePieChart(newYear);
      
    }

    //Update the event listener to call the optionChanged function when a new year is selected:
    d3.select("#selDataset").on("change", function() {
      // Get the selected year value from the dropdown
      let newYear = d3.select(this).property("value");
      optionChanged(newYear);
    });

}

// Initialize the dashboard
init();


function googleChart(year) {
// Building google interactive pie chart
// Load the Visualization API and the controls package.
  // Packages for all the other charts you need will be loaded
  // automatically by the system.
  google.charts.load('current', {'packages':['corechart', 'controls']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawDashboard);

  function drawDashboard() {
    let dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
 

    d3.json('Resources/traffic_accidents_data.json').then((data) => {
      // Convert year to number
      year = +year; 
  
      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);
  
      // Group the data by road conditions and count the occurrences
      let rdCond = d3.rollup(
        dataForYear,
        v => v.length,
        d => d.RDSFCOND
      );

      // Transform data into an array
      let rdCondData = Array.from(rdCond);
      
     
      // Rename null values to "unspecified"
      for (data of rdCondData){
           if (data[0] === null) {data[0] = "Unspecified"};
      }

      // Creating a google DataTable object
      let rdCondtable = new google.visualization.DataTable();

       rdCondtable.addColumn('string', 'Road Condition');
       rdCondtable.addColumn('number', 'Number of Accidents');
       rdCondtable.addRows(rdCondData);
      

     // Create a range slider, passing some options
     let accidentRangeSlider = new google.visualization.ControlWrapper({
      'controlType': 'NumberRangeFilter',
      'containerId': 'filter_div',
      'options': {
        'filterColumnLabel': 'Number of Accidents'
      }
    });

   
    // Create a pie chart, passing some options
    let accPieChart = new google.visualization.ChartWrapper({
      'chartType': 'PieChart',
      'containerId': 'chart_div',
      'options': {
        'width': 500,
        'height': 500,
        'pieSliceText': 'label',
        'title': "Car Accidents by road conditions"
      },
      // The pie chart will use the columns 'Road Condition' and 'Number of Accidents'
      // out of all the available ones.
      'view': {'columns': [0, 1]}
    });

    
      // 'pieChart' will update whenever you interact with 'AccidentRangeSlider'
      // to match the selected range.
      dashboard.bind(accidentRangeSlider,  accPieChart);
      dashboard.draw(rdCondtable);


      changeRange = function() {
        accidentRangeSlider.setState({'lowValue': 0, 'highValue': 100});
        accidentRangeSlider.draw();
      };

      changeOptions = function() {
        accPieChart.setOption('is3D', true);
        accPieChart.draw();
      };



  })
}};

function plotlyScatter(year) {
  d3.json('Resources/theft_data.json').then((data) => {
    // Convert year to number
    year = +year;
    // Filter the data for the specified year
    let dataForYear = data.filter(d => d.YEAR === year);
    // Group the data by neighborhood and count the occurrences
    let theftReportByMonth = d3.rollup(
      dataForYear,
      v => v.length,
      d => d.REPORT_MONTH

    );

    d3.json('Resources/traffic_accidents_data.json').then((data) => {
      // Filter the data for the specified year
      let trafDataForYear = data.filter(d => d.YEAR === year);
      // Group the data by neighborhood and count the occurrences
      let TrafAccidentsByMonth = d3.rollup(
        trafDataForYear,
      v => v.length,
      d => d.MONTH
      );



    // Converting the data into a list
    let theftMonthlyReport = Array.from(theftReportByMonth);
    let TrafMonthlyReport = Array.from(TrafAccidentsByMonth)

    // Extract the months and counts for the chart
    let theftMonths = theftMonthlyReport.map(d => d[0]);
    let theftCounts = theftMonthlyReport.map(d => d[1]);
    let accMonths = TrafMonthlyReport.map(d => d[0]);
    let accCounts = TrafMonthlyReport.map(d => d[1]);


    // Create a scatter plot using Plotly
    let trace1 = {
      x: theftMonths,
      y: theftCounts,
      mode: 'markers',
      type: 'scatter',
      marker: { size: 12 },
      name: "Car Theft Count"
    };

    let trace2 = {
      x: accMonths,
      y:accCounts,
      mode: 'markers',
      type: 'scatter',
      marker: { size: 12 },
      name: "Car Accident Count"
    };

    layout = {
          title: `Car thefts reported each month for ${year}`
    };

    Plotly.newPlot('scatter', [trace1,trace2], layout);
    })}
  )};






function leafletmap(year) {

  let container = L.DomUtil.get('map');
      if(container != null){
        container._leaflet_id = null;
      }

  let myMap = L.map("map", {
    center: [43.75107, -79.847015],
    zoom: 10.5
  });
  
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Assuming myMap is your Leaflet map object
  
  // Remove existing layer control if it exists
  if (typeof layerControl !== 'undefined') {
    myMap.removeControl(layerControl);
  }
  
  // Get the data with D3
  d3.json('Resources/traffic_accidents_data.json').then(function(response) {
    
    // Clear existing markers from the map
    Object.keys(myMap._layers).forEach(function (layer) {
      if (myMap._layers[layer]._path != undefined) {
        myMap.removeLayer(myMap._layers[layer]);
      }
    });

    // Convert year to number
    year = +year;
    
    // Filter the data for the specified year and fatal injuries
    let dataForYearFatal = response.filter(d => d.YEAR === year && d.ACCLASS === "Fatal");
    let dataForYearNonFatal = response.filter(d => d.YEAR === year && d.ACCLASS === "Non-Fatal Injury");

    let fatalLayerGroup;
    let nonFatalLayerGroup;

    // Create LayerGroups for Fatal and Non-Fatal accidents
    if (fatalLayerGroup) {
      console.log(fatalLayerGroup),
      myMap.removeLayer(fatalLayerGroup)
    };
    if (nonFatalLayerGroup) {
      console.log(nonFatalLayerGroup),
      myMap.removeLayer(nonFatalLayerGroup)
    };

    fatalLayerGroup = L.layerGroup();
    nonFatalLayerGroup = L.layerGroup();

    // Add markers for Fatal accidents
    dataForYearFatal.forEach(function(data) {
      let marker = L.marker([data.LATITUDE, data.LONGITUDE])
        .bindPopup(`<b>${data.STREET1}</b><br>${data.DISTRICT}<br>${data.ACCLASS}<br> ${data.YEAR}</br>`);
      fatalLayerGroup.addLayer(marker);
    });

    // Add markers for Non-Fatal accidents
    dataForYearNonFatal.forEach(function(data) {
      let marker = L.marker([data.LATITUDE, data.LONGITUDE])
        .bindPopup(`<b>${data.STREET1}</b><br>${data.DISTRICT}<br>${data.ACCLASS}`);
      nonFatalLayerGroup.addLayer(marker);
    });

    // Create an overlay object to hold our overlay layers
    let overlayMaps = {
      "Fatal": fatalLayerGroup,
      "Non Fatal": nonFatalLayerGroup
    };

    // Create a new layer control
    layerControl = L.control.layers(null, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Initially add fatalLayers to the map
    fatalLayerGroup.addTo(myMap);
    
  });
}