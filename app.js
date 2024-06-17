// Build the metadata panel

function DataPanel(year) {
  d3.json('Resources/theft_data.json').then((data) => {
      // Convert year to number
      year = +year;

      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);

      // Calculate the count of occurrences for the specified year
      let count = dataForYear.length;
      let message = `Number of car thefts for the year ${year}: ${count} vehicles`; 

      // Use d3 to select the panel with id of `#sample-metadata`
        let demoInfoPanel = d3.select('#sample-metadata');

      // Use `.html("") to clear any existing metadata
        demoInfoPanel.html('');

        // Display the new message below the "Summary" section
        demoInfoPanel.append('p').text(message);

        //retreive car accidents data
        d3.json('Resources/traffic_accidents_data.json').then((Accdata) => {
        //filter the data for the specified year
        let AccDataYear = Accdata.filter(d => d.YEAR == year);

        // Calculate the count of occurrences for the specified year
        let count2 = AccDataYear.length;  
        let message2 = `Number of car accidents for the year ${year}: ${count2} accidents`

        // Display the new message below the "Summary" section
        demoInfoPanel.append('p').text(message2);
  });
})
};


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


function optionChanged(newYear) {
  // Build charts each time a new year is selected
  DataPanel(newYear);
  Theftgraph(newYear);
  Accidentgraph(newYear);
  Piechart(newYear);
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

  // Update the event listener to call the optionChanged function when a new year is selected
  dropdown.on("change", function() {
      // Get the selected year value from the dropdown
      let newYear = d3.select(this).property("value");
      optionChanged(newYear);
  });

  // Load data and count occurrences for the first year initially
  DataPanel(years[0]);
  Theftgraph(years[0])
  Accidentgraph(years[0]);
  Piechart(years[0])
}

// Initialize the dashboard
init();










//------------------------------------------------------------------------

// // Build the metadata panel
// function buildMetadata(sample) {
//     d3.json('Resources/traffic_accidents_data.json').then((data) => {
    
    
        
      
  
//       // Filter the metadata for the object with the desired sample number
//       let resultArray = data.filter(sampleObj => sampleObj.YEAR == sample);
//       let result = resultArray[0];

//       console.log(result)
  
//       // Use d3 to select the panel with id of `#sample-metadata`
//       let panel = d3.select("#sample-metadata");
  
//       // Use `.html("") to clear any existing metadata
//       panel.html("");
  
//       // Inside a loop, you will need to use d3 to append new
//       // tags for each key-value in the filtered metadata.
//       Object.entries(result).forEach(([key, value]) => {
//         let text = `${key.toUpperCase()}: ${value}`;
//         panel.append("p").text(text);
//       });
//     });
//   }
  
//   // function to build both charts
//   function buildCharts(sample) {
//     d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
//       // Get the samples field
//       let samples = data.samples;
//       // Filter the samples for the object with the desired sample number
//       let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
//       let result = resultArray[0];
  
//       // Get the otu_ids, otu_labels, and sample_values
//       let otuIds = result.otu_ids;
//       let otuLabels = result.otu_labels;
//       let sampleValues = result.sample_values;
  
//       // Build a Bubble Chart
//       let bubbleTrace = {
//         x: otuIds,
//         y: sampleValues,
//         text: otuLabels,
//         mode: 'markers',
//         marker: {
//           size: sampleValues,
//           color: otuIds,
//           colorscale: 'Earth'
//         }
//       };
  
//       let bubbleData = [bubbleTrace];
  
//       let bubbleLayout = {
//         title: 'Bacteria Cultures Per Sample',
//         xaxis: { title: 'OTU ID' }
//       };
  
  
//       // Render the Bubble Chart
  
//       Plotly.newPlot('bubble', bubbleData, bubbleLayout);  
  
//       // For the Bar Chart, map the otu_ids to a list of strings for your yticks
//       let yTicks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
  
//       // Build a Bar Chart
//       // Don't forget to slice and reverse the input data appropriately
//       let barTrace = {
//         x: sampleValues.slice(0, 10).reverse(),
//         y: yTicks,
//         text: otuLabels.slice(0, 10).reverse(),
//         type: 'bar',
//         orientation: 'h'
//       };
      
//       let barData = [barTrace];
      
//       let barLayout = {
//         title: 'Top 10 OTUs Found',
//         xaxis: { title: 'Number of Bacteria' }
//       };
  
//       // Render the Bar Chart
//       Plotly.newPlot('bar', barData, barLayout);
//     });
//   }
  
//   // Function to run on page load
//   function init() {
//         // Create an array of years from 2018 to 2023
//         let years = Array.from({length: 6}, (_, index) => 2018 + index);
      
//         // Select the dropdown element
//         let dropdown = d3.select("#selDataset");
      
//         // Populate the dropdown with the years
//         years.forEach(year => {
//           dropdown.append("option")
//             .text(year)
//             .attr("value", year);
//         });
      
//         // Get the first year (2018) from the list
//         let firstYear = years[0];
      
//         // Build charts and metadata panel with the first year
//         buildMetadata(firstYear);
//         buildCharts(firstYear);
//       //Update the optionChanged function to handle the selection of a new year:
//       function optionChanged(newYear) {
//         // Build charts and metadata panel each time a new year is selected
//         buildMetadata(newYear);
//         buildCharts(newYear);
//       }
//       //Update the event listener to call the optionChanged function when a new year is selected:
//       d3.select("#selDataset").on("change", function() {
//         // Get the selected year value from the dropdown
//         let newYear = d3.select(this).property("value");
//         optionChanged(newYear);
//       });
  
//   }
  
//   // Initialize the dashboard
//   init();
  