import {
  Box,
  Container,
  Button,
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
import React from "react";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WindowIcon from "@mui/icons-material/Window";
import SearchIcon from "@mui/icons-material/Search";
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

export default function Header3() {
  const { currentLanguage } = useLanguage();
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

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Stack spacing={2}>
        {/* Only Navigation Row: Categories, Client Reviews, Contact Us */}
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
        </Box>
        {/* Categories Bar (if any) can be here if needed */}
      </Stack>
    </Container>
  );
}
