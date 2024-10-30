'use client';
import * as React from 'react';
import Link from 'next/link';
import { useState } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

// Sidebar Component
const Sidebar = () => {
 

  const [openOrders, setOpenOrders] = useState(false);
  const [openCustomers, setOpenCustomers] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const toggleOpenOrders = () => setOpenOrders(!openOrders);
  const toggleOpenCustomers = () => setOpenCustomers(!openCustomers);
  const toggleOpenReports = () => setOpenReports(!openReports);
  const toggleOpenDelivery = () => setOpenDelivery(!openDelivery);
  const toggleOpenSettings = () => setOpenSettings(!openSettings);

  return (
    <div className="text-white p-6 shadow-lg flex flex-col bg-black justify-between h-full max-h-full">
      

      {/* Navigation Links */}
      <div className="overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        <List component="nav" className="space-y-4">
          {/* Dashboard */}
          <Link href="/dashboard" passHref>
            <ListItem component="button" className="hover:bg-gray-700 rounded pl-2">
              <ListItemIcon className="text-white">
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '1rem' }} />
            </ListItem>
          </Link>

          {/* Orders */}
          <ListItem component="button" onClick={toggleOpenOrders} className="hover:bg-gray-700 rounded pl-2">
            <ListItemIcon className="text-white">
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" primaryTypographyProps={{ fontSize: '1rem' }} />
            {openOrders ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openOrders} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="pl-4">
              
              <Link href="/dashboard/BackOrders" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                    <ListItemIcon className="text-white">
                    <ListAltIcon />
                    </ListItemIcon>
                  <ListItemText primary="Back Orders" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          {/* Customers */}
          <ListItem component="button" onClick={toggleOpenCustomers} className="hover:bg-gray-700 rounded pl-2">
            <ListItemIcon className="text-white">
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customers" primaryTypographyProps={{ fontSize: '1rem' }} />
            {openCustomers ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openCustomers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="pl-4">
              <Link href="/dashboard/CustomerList" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customer List" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              <Link href="/dashboard/remove-user" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <RemoveCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Remove User" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              
            </List>
          </Collapse>
          

          {/* Reports & Analytics */}
          <ListItem component="button" onClick={toggleOpenReports} className="hover:bg-gray-700 rounded pl-2">
            <ListItemIcon className="text-white">
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports & Analytics" primaryTypographyProps={{ fontSize: '1rem' }} />
            {openReports ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openReports} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="pl-4">
              <Link href="../dashboard/QuarterlySalesReport" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Quarterly Sales Report" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              <Link href="../dashboard/ProductsWithMostNumberOfSales" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <TrendingUpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Top-Selling Products" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              <Link href="../dashboard/ProductCategoryWithMostOrders" passHref>
                <ListItem component="button"className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Category Performance" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              <Link href="../dashboard/TimePeriodWithMostInterest" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <TrendingUpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Product Interest Report" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              <Link href="../dashboard/CustomerOrderReport" passHref>
                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <PeopleAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customer Order Report" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
            </List>
          </Collapse>

          

          {/* Settings */}
          <ListItem component="button" onClick={toggleOpenSettings} className="hover:bg-gray-700 rounded pl-2">
            <ListItemIcon className="text-white">
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '1rem' }} />
            {openSettings ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSettings} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="pl-4">

              <Link href="../dashboard/settings/user-permissions" passHref>

                <ListItem component="button" className="pl-4 hover:bg-gray-700 rounded">
                  <ListItemIcon className="text-white">
                    <AddModeratorIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add admin" primaryTypographyProps={{ fontSize: '0.7rem' }} />
                </ListItem>
              </Link>
              
            </List>
          </Collapse>
        </List>
      </div>
    </div>
  );
};

export default Sidebar;
