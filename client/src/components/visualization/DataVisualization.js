import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as d3 from 'd3';
import axios from 'axios';

const DataVisualization = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && selectedCountry) {
      drawChart();
    }
  }, [data, selectedCountry]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/data', {
        headers: {
          'x-auth-token': token,
        },
      });
      
      // Sort data by date
      const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setData(sortedData);
      
      // Extract unique countries
      const uniqueCountries = [...new Set(sortedData.map(item => item.country))];
      setCountries(uniqueCountries);
      
      if (uniqueCountries.length > 0) {
        setSelectedCountry(uniqueCountries[0]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const drawChart = () => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Filter data for selected country
    const countryData = data.filter(d => d.country === selectedCountry);

    if (countryData.length === 0) {
      setError('No data available for selected country');
      return;
    }

    // Set up dimensions
    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleTime()
      .domain(d3.extent(countryData, d => new Date(d.date)))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(countryData, d => Math.max(d.totalCases, d.totalDeaths, d.totalRecovered))])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .text('Date');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Cases');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - (margin.top / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(`COVID-19 Statistics for ${selectedCountry}`);

    // Create line generators
    const createLine = (accessor) => {
      return d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(accessor(d)));
    };

    // Add lines
    const addLine = (data, accessor, color, name) => {
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', createLine(accessor));

      // Add dots
      svg.selectAll(`dot-${name}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(accessor(d)))
        .attr('fill', color);
    };

    // Add the lines
    addLine(countryData, d => d.totalCases, 'steelblue', 'cases');
    addLine(countryData, d => d.totalDeaths, 'red', 'deaths');
    addLine(countryData, d => d.totalRecovered, 'green', 'recovered');

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 120}, 0)`);

    const legendItems = [
      { label: 'Total Cases', color: 'steelblue' },
      { label: 'Total Deaths', color: 'red' },
      { label: 'Recovered', color: 'green' }
    ];

    legendItems.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
        
      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', item.color);

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .text(item.label)
        .style('font-size', '12px');
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/dashboard')} 
          sx={{ mb: 2 }}
          aria-label="back to dashboard"
        >
          <ArrowBackIcon /> Back to Dashboard
        </IconButton>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            COVID Data Visualization
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Select Country</InputLabel>
                    <Select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      label="Select Country"
                    >
                      {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box 
                sx={{ 
                  mt: 4, 
                  width: '100%', 
                  overflowX: 'auto'
                }} 
                ref={chartRef}
              />
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default DataVisualization; 