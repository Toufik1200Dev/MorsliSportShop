import {
  Box,
  Container,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WindowIcon from "@mui/icons-material/Window";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Close } from "@mui/icons-material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useLanguage } from "../../LanguageContext";
import { getTranslation } from "../../translations";
import { useSelector } from "react-redux";

export default function Header3() {
  const { currentLanguage } = useLanguage();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchor);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const theme = useTheme();

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Stack spacing={2}>
        {/* Top Row - Logo and Search */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <img 
                src="/images/MorsliSportLogo.png" 
                alt="Morsli Sport Logo" 
                style={{ 
                  height: "50px", 
                  width: "100px", 
                  objectFit: 'contain' 
                }} 
              />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 900, 
                  color: '#1976d2',
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Morsli Sport
              </Typography>
            </Stack>
          </Link>

          {/* Search Bar */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: { xs: '100%', md: '50%' },
            maxWidth: 600,
            bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            borderRadius: 2,
            px: 2,
            py: 1
          }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder={getTranslation('searchPlaceholder', currentLanguage)}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ flex: 1, fontSize: '1rem' }}
            />
          </Box>

          {/* User Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Cart */}
            <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
              <IconButton color="inherit">
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>

            {/* User Menu */}
            <IconButton
              onClick={handleUserMenuClick}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Stack>
        </Box>

        {/* Bottom Row - Categories and Navigation */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          {/* Categories Button */}
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                width: { xs: '100%', sm: 222 },
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                color: theme.palette.text.primary,
                justifyContent: 'space-between',
                px: 2,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WindowIcon />
                <Typography
                  sx={{
                    p: "0",
                    textTransform: "capitalize",
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {getTranslation('categories', currentLanguage)}
                </Typography>
              </Box>
              <KeyboardArrowRightIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  sx: {
                    width: { xs: '100%', sm: 222 },
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    borderRadius: 2,
                    mt: 1
                  },
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <SportsSoccerIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={getTranslation('football', currentLanguage)} />
              </MenuItem>

              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <SportsKabaddiIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={getTranslation('combatSports', currentLanguage)} />
              </MenuItem>

              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <HeartBrokenIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={getTranslation('cardio', currentLanguage)} />
              </MenuItem>

              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <FitnessCenterIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={getTranslation('musculation', currentLanguage)} />
              </MenuItem>
            </Menu>
          </Box>

          {/* Navigation Links */}
          {!useMediaQuery("(min-width:600px)") ? (
            <IconButton 
              onClick={toggleDrawer("left", true)}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'flex-end', sm: 'center' }
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack 
              direction="row" 
              spacing={3}
              sx={{ 
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <Link to="/avis-client" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography sx={{ cursor: "pointer", fontWeight: 500 }} variant="body1">
                  {getTranslation('clientReviews', currentLanguage)}
                </Typography>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography sx={{ cursor: "pointer", fontWeight: 500 }} variant="body1">
                  {getTranslation('contactUs', currentLanguage)}
                </Typography>
              </Link>
            </Stack>
          )}
        </Box>

        {/* Categories Bar */}
        <Box sx={{ 
          mt: 2,
          py: 2,
          px: 1,
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          borderRadius: 2,
          boxShadow: '0 4px 20px 0 rgba(25,118,210,0.15)'
        }}>
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)', borderRadius: 2 },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.3)', borderRadius: 2 },
              '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255,255,255,0.5)' }
            }}
          >
            {[
              { icon: <SportsSoccerIcon />, label: getTranslation('football', currentLanguage), color: '#4caf50' },
              { icon: <SportsKabaddiIcon />, label: getTranslation('combatSports', currentLanguage), color: '#f44336' },
              { icon: <HeartBrokenIcon />, label: getTranslation('cardio', currentLanguage), color: '#ff9800' },
              { icon: <FitnessCenterIcon />, label: getTranslation('musculation', currentLanguage), color: '#9c27b0' },
              { icon: <SportsSoccerIcon />, label: 'Tennis', color: '#00bcd4' },
              { icon: <FitnessCenterIcon />, label: 'Yoga', color: '#795548' },
              { icon: <SportsKabaddiIcon />, label: 'Boxing', color: '#607d8b' },
              { icon: <HeartBrokenIcon />, label: 'Running', color: '#e91e63' }
            ].map((category, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: 'fit-content',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)'
                  }
                }}
              >
                <Box sx={{ 
                  color: category.color, 
                  display: 'flex', 
                  alignItems: 'center',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}>
                  {category.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {category.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={userMenuOpen}
        onClose={handleUserMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 200,
              bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              borderRadius: 2,
              mt: 1
            },
          },
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={getTranslation('myProfile', currentLanguage)} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={getTranslation('login', currentLanguage)} />
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={getTranslation('register', currentLanguage)} />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        sx={{
          ".MuiPaper-root": { 
            height: "100%",
            bgcolor: theme.palette.mode === 'dark' ? "#151e3d" : "#fff",
            width: { xs: '100%', sm: 300 }
          }
        }}
      >
        <Box
          sx={{
            maxWidth: 300,
            mx: "auto",
            mt: 6,
            position: "relative",
            pt: 10,
            px: 2
          }}
        >
          <IconButton
            sx={{
              ":hover": { rotate: "180deg", transition: "0.3s", color: "red" },
              position: "absolute",
              right: 0,
              top: -40,
            }}
            onClick={toggleDrawer("left", false)}
          >
            <Close />
          </IconButton>

          {[
            {
              Page1: getTranslation('pages', currentLanguage),
              subPage1: [
                { name: getTranslation('home', currentLanguage), link: "/" },
                { name: getTranslation('contactUs', currentLanguage), link: "/contact" },
                { name: getTranslation('customerReviews', currentLanguage), link: "/avis-client" }
              ],
            },
          ].map((item) => {
            return (
              <Accordion
                key={item.Page1}
                elevation={0}
                sx={{ bgcolor: "initial" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>{item.Page1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ py: 0, my: 0 }}>
                    {item.subPage1.map((link) => {
                      return (
                        <ListItem key={link.name}>
                          <ListItemButton component={Link} to={link.link}>
                            <ListItemText primary={link.name} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Drawer>
    </Container>
  );
}
