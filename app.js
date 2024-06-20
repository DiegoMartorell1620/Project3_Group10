
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

          // Log the totals for debugging
          console.log("Total Traffic Accidents:", totalTrafficAccidents);
          console.log("Total Thefts:", totalThefts);

        }).
        catch(error => {
          console.error('Error loading theft_data.json:', error);
          // Display an error message in the panel
           d3.select("#summary-panel").html("<p>Error loading data.</p>");
         });

    })

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
      console.log(accidentCountByNeighborhood);
      // Create a bar chart using Plotly
      let trace = {
        x: neighborhoods,
        y: accidentCounts,
        type: 'bar'
      };
      let layout = {
        title: `Top 10 Neighborhoods with highest # Accidents in ${year}`,
        yaxis: { title: '# of Accidents' }
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
        title: `Top 10 Neighborhoods with highest # of Thefts in ${year}`,
        yaxis: { title: '# of thefts' }
      };
      Plotly.newPlot('bar1', [trace], layout);
  });
}


function Piechart(year) {
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
        values: accidentCounts,
        labels: neighborhoods,
        type: 'pie'
      };
      let layout = {
        title: `Top 10 Neighborhoods with highest # Accidents in ${year}`,
        height: 400,
        width: 500
      };
      Plotly.newPlot('pie1', [trace], layout);
  });
}


// // Function to create a pie chart showing accidents by age using Chart.js
// function AccidentsByAgePieChart(data) {
//   // Filter out data where age is unknown or not specified
//   data = data.filter(d => d.INVAGE !== null && d.INVAGE !== undefined && d.INVAGE !== '');

//   // Group data by age and count occurrences
//   let accidentCountByAge = data.reduce((acc, cur) => {
//     let age = cur.INVAGE;
//     acc[age] = (acc[age] || 0) + 1;
//     return acc;
//   }, {});

//   // Extract labels (age groups) and data (counts) for the chart
//   let labels = Object.keys(accidentCountByAge);
//   let dataCounts = Object.values(accidentCountByAge);

//   // Create a random color generator function
//   function getRandomColor() {
//     return '#' + (Math.random().toString(16) + '000000').slice(2, 8);
//   }

//   // Generate random colors for each data point
//   let backgroundColors = labels.map(() => getRandomColor());

//   // Chart.js configuration
//   let config = {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: dataCounts,
//         backgroundColor: backgroundColors,
//         borderWidth: 1
//       }]
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         tooltip: {
//           callbacks: {
//             label: function(tooltipItem) {
//               return `${tooltipItem.label}: ${tooltipItem.raw}`;
//             }
//           }
//         }
//       },
//       title: {
//         display: true,
//         text: 'Accidents by Age Group'
//       }
//     }
//   };

//   // Get the canvas element where the chart will be rendered
//   let ctx = document.getElementById('accidentsByAgeChart').getContext('2d');

//   // Create the pie chart using Chart.js
//   let myPieChart = new Chart(ctx, config);
// }

// // Example function to fetch and load data
// function loadDataAndCreateChart() {
//   // Replace with your actual data loading mechanism (e.g., fetch, d3.json)
//   d3.json('Resources/traffic_accidents_data.json')
//     .then(data => {
//       // Assuming 'data' is an array of objects with accident data
//       AccidentsByAgePieChart(data);
//     })
//     .catch(error => {
//       console.error('Error loading data:', error);
//     });
// }

// // Call the function to load data and create the chart when the page loads
// document.addEventListener('DOMContentLoaded', function() {
//   loadDataAndCreateChart();
// });

// Function to create a pie chart showing accidents by age using Chart.js
function AccidentsByAgePieChart(year) {
  // Load the JSON data for accidents
  d3.json('Resources/traffic_accidents_data.json').then(data => {
    // Filter data by year
    data = data.filter(d => d.YEAR === year);

    // Filter out data where age is unknown or not specified
    data = data.filter(d => d.INVAGE !== null && d.INVAGE !== undefined && d.INVAGE !== '');

    // Define age categories mapping using let
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

    let orderedLabels = ["< 20", "20-29", "30-39", "40-49", "50-59", "60-69", "70+", "Unknown"];

    // Group data by age and count occurrences in each category
    let accidentCountByAgeCategory = data.reduce((acc, cur) => {
      let ageRange = cur.INVAGE;
      let ageCategory = ageCategories[ageRange] || "Unknown";
      acc[ageCategory] = (acc[ageCategory] || 0) + 1;
      return acc;
    }, {});

    // Extract labels (age groups) and data (counts) for the chart
    let labels = orderedLabels.filter(label => accidentCountByAgeCategory[label] !== undefined);
    let dataCounts = labels.map(label => accidentCountByAgeCategory[label]);

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
        radius: 300,
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
              // Generate custom legend items
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

                // Order legend items
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

    // Get the canvas element where the chart will be rendered
    let ctx = document.getElementById('accidentsByAgeChart').getContext('2d');

    // Create the pie chart using Chart.js
    let myPieChart = new Chart(ctx, config);
  })

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
      Piechart(firstYear);
      AccidentsByAgePieChart(firstYear);
     //buildCharts(firstYear);
    
     //Update the optionChanged function to handle the selection of a new year:
    function optionChanged(newYear) {
      // Build charts and metadata panel each time a new year is selected
      calculateAndDisplaySummary(newYear);
      Theftgraph(newYear);
      Accidentgraph(newYear);
      Piechart(newYear);
      AccidentsByAgePieChart(newYear);
      //buildCharts(newYear);
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
