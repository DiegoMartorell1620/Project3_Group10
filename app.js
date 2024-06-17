// Build the metadata panel

function Theftcard(year) {
  d3.json('Resources/theft_data.json').then((data) => {
      // Convert year to number
      year = +year;

      // Filter the data for the specified year
      let dataForYear = data.filter(d => d.YEAR === year);

      // Calculate the count of occurrences for the specified year
      let count = dataForYear.length;
      let message = `Number of car thefts for the year ${year}-> ${count} vehicles`;

      // Clear previous message
      let summaryDiv = document.getElementById('sample-metadata');
      summaryDiv.innerHTML = '';

      // Display the new message below the "Summary" section
      let messageDiv = document.createElement('div');
      messageDiv.textContent = message;
      summaryDiv.appendChild(messageDiv);
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

      Plotly.newPlot('bar', [trace], layout);
  });
}


function optionChanged(newYear) {
  // Build charts each time a new year is selected
  Theftcard(newYear);
  Theftgraph(newYear)
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
  Theftcard(years[0]);
  Theftgraph(years[0]);
}

// Initialize the dashboard
init();

  