import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  IconButton,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const DataEntry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    country: '',
    region: '',
    totalCases: '',
    totalDeaths: '',
    totalRecovered: '',
    newCases: '',
    newDeaths: '',
    population: '',
    source: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/data', formData, {
        headers: {
          'x-auth-token': token,
        },
      });
      setSuccess('Data added successfully');
      setFormData({
        date: '',
        country: '',
        region: '',
        totalCases: '',
        totalDeaths: '',
        totalRecovered: '',
        newCases: '',
        newDeaths: '',
        population: '',
        source: '',
      });
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      let message = 'An error occurred';
      if (err.response) {
        if (err.response.data) {
          message = err.response.data.msg || err.response.data.message || JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
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
            Enter COVID Data
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Snackbar
            open={Boolean(success)}
            autoHideDuration={3000}
            onClose={() => setSuccess('')}
            message={success}
          />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={Boolean(error && !formData.date)}
                  helperText={error && !formData.date ? "Date is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.country)}
                  helperText={error && !formData.country ? "Country is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.region)}
                  helperText={error && !formData.region ? "Region is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Cases"
                  name="totalCases"
                  type="number"
                  value={formData.totalCases}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.totalCases)}
                  helperText={error && !formData.totalCases ? "Total cases is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Deaths"
                  name="totalDeaths"
                  type="number"
                  value={formData.totalDeaths}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.totalDeaths)}
                  helperText={error && !formData.totalDeaths ? "Total deaths is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Recovered"
                  name="totalRecovered"
                  type="number"
                  value={formData.totalRecovered}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.totalRecovered)}
                  helperText={error && !formData.totalRecovered ? "Total recovered is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Cases"
                  name="newCases"
                  type="number"
                  value={formData.newCases}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.newCases)}
                  helperText={error && !formData.newCases ? "New cases is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Deaths"
                  name="newDeaths"
                  type="number"
                  value={formData.newDeaths}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.newDeaths)}
                  helperText={error && !formData.newDeaths ? "New deaths is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Population"
                  name="population"
                  type="number"
                  value={formData.population}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.population)}
                  helperText={error && !formData.population ? "Population is required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  error={Boolean(error && !formData.source)}
                  helperText={error && !formData.source ? "Source is required" : ""}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Data'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DataEntry; 