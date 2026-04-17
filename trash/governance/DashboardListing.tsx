import { Grid, Card, CardContent, CardActionArea, Typography, Fab, Box } from '@mui/material';
import { Add, Dashboard as DashIcon } from '@mui/icons-material';

const DashboardListing = () => {
  const dashboards = [
    { id: '1', name: 'Global Governance', widgets: 8, lastUpdated: '2 hours ago' },
    { id: '2', name: 'ROI & Productivity', widgets: 4, lastUpdated: '1 day ago' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>My Dashboards</Typography>
      <Grid container spacing={3}>
        {dashboards.map((db) => (
          <Grid item xs={12} sm={6} md={4} key={db.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' } }}>
              <CardActionArea sx={{ p: 2 }}>
                <DashIcon color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6">{db.name}</Typography>
                <Typography variant="body2" color="textSecondary">{db.widgets} Widgets • Updated {db.lastUpdated}</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32 }}>
        <Add />
      </Fab>
    </Box>
  );
};