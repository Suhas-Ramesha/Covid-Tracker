import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Add as AddIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const features = [
    {
      title: 'Data Entry',
      description: 'Enter new COVID data or upload data files',
      icon: <AddIcon fontSize="large" />,
      path: '/data-entry',
    },
    {
      title: 'Data Visualization',
      description: 'View interactive charts and graphs of COVID data',
      icon: <ShowChartIcon fontSize="large" />,
      path: '/visualization',
    },
    {
      title: 'Reports',
      description: 'Generate and view detailed reports',
      icon: <AssessmentIcon fontSize="large" />,
      path: '/reports',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            COVID Data Analytics
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(feature.path)}
                  >
                    Go to {feature.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 