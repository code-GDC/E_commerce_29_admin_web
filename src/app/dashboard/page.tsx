"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { TrendingUp, People, MonetizationOn, ShoppingCart } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

// Register components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage: React.FC = () => {
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Top Gross',
                data: [50, 100, 150, 125, 175, 200, 150, 130, 140, 160, 170, 190],
                fill: false,
                borderColor: '#4bc0c0',
                tension: 0.4,  // Smooth curve
            },
            {
                label: 'First Half',
                data: [40, 90, 130, 100, 140, 160, 120, 110, 130, 150, 160, 180],
                fill: false,
                borderColor: '#565656',
                tension: 0.4,  // Smooth curve
            },
        ],
    };

    const topSellingProducts = [
        { id: 1, name: 'Denim Jacket', category: 'Men\'s Tops', stock: 'In Stock', totalSales: '1.43k' },
        { id: 2, name: 'Nike Air Max 97', category: 'Men\'s Shoes', stock: 'Out of Stock', totalSales: '2.68k' },
        { id: 3, name: 'Jordan Air', category: 'Men\'s T-Shirt', stock: 'In Stock', totalSales: '1.43k' },
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Grid container spacing={4} justifyContent="center">
                {/* Statistic Cards */}
                <Grid item xs={12} sm={4}>
                    <Card style={{ backgroundColor: '#e0f7fa', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Grid container alignItems="center">
                                <IconButton>
                                    <People style={{ fontSize: 40, color: '#00796b' }} />
                                </IconButton>
                                <div>
                                    <Typography variant="h6">Total Customers</Typography>
                                    <Typography variant="h4">307.48K</Typography>
                                    <Typography color="textSecondary">+30% This month</Typography>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card style={{ backgroundColor: '#c8e6c9', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Grid container alignItems="center">
                                <IconButton>
                                    <MonetizationOn style={{ fontSize: 40, color: '#388e3c' }} />
                                </IconButton>
                                <div>
                                    <Typography variant="h6">Total Revenue</Typography>
                                    <Typography variant="h4">$30.58K</Typography>
                                    <Typography color="textSecondary">-15% This month</Typography>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card style={{ backgroundColor: '#ffe0b2', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Grid container alignItems="center">
                                <IconButton>
                                    <ShoppingCart style={{ fontSize: 40, color: '#ff8f00' }} />
                                </IconButton>
                                <div>
                                    <Typography variant="h6">Total Deals</Typography>
                                    <Typography variant="h4">2.48K</Typography>
                                    <Typography color="textSecondary">+23% This month</Typography>
                                </div>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Earnings Chart */}
                <Grid item xs={12}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Earnings</Typography>
                            <Line data={chartData} />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Top Selling Products Table */}
                <Grid item xs={12}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
                            <Table>
                                <TableHead style={{ backgroundColor: grey[200] }}>
                                    <TableRow>
                                        <TableCell>S/No</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Stock</TableCell>
                                        <TableCell>Total Sales</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topSellingProducts.map((product) => (
                                        <TableRow key={product.id} hover>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>{product.totalSales}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default DashboardPage;