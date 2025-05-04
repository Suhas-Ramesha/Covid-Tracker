import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const Reports = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCases: 0,
    totalDeaths: 0,
    totalRecovered: 0,
    countries: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/data', {
        headers: {
          'x-auth-token': token,
        },
      });

      const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setData(sortedData);

      // Calculate statistics
      const uniqueCountries = new Set(sortedData.map(item => item.country));
      const totalStats = sortedData.reduce((acc, curr) => ({
        totalCases: acc.totalCases + curr.newCases,
        totalDeaths: acc.totalDeaths + curr.newDeaths,
        totalRecovered: acc.totalRecovered + curr.totalRecovered,
      }), { totalCases: 0, totalDeaths: 0, totalRecovered: 0 });

      setStats({
        ...totalStats,
        countries: uniqueCountries.size,
      });

      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
            COVID-19 Reports
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
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Cases
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatNumber(stats.totalCases)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Deaths
                      </Typography>
                      <Typography variant="h5" component="div" sx={{ color: 'error.main' }}>
                        {formatNumber(stats.totalDeaths)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Recovered
                      </Typography>
                      <Typography variant="h5" component="div" sx={{ color: 'success.main' }}>
                        {formatNumber(stats.totalRecovered)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Countries Affected
                      </Typography>
                      <Typography variant="h5" component="div">
                        {stats.countries}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Recent Data Entries
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell align="right">New Cases</TableCell>
                      <TableCell align="right">New Deaths</TableCell>
                      <TableCell align="right">Total Cases</TableCell>
                      <TableCell align="right">Total Deaths</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(row.date)}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell align="right">{formatNumber(row.newCases)}</TableCell>
                        <TableCell align="right">{formatNumber(row.newDeaths)}</TableCell>
                        <TableCell align="right">{formatNumber(row.totalCases)}</TableCell>
                        <TableCell align="right">{formatNumber(row.totalDeaths)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Reports; 