import React from "react";
import { useContext } from "react";
// @ts-ignore
import { ColorModeContext } from "../../theme";
import { Box, Container, IconButton, Stack, Typography, useTheme } from "@mui/material";
import {
  DarkModeOutlined,
  Expand,
  ExpandMore,
  LightModeOutlined,
} from "@mui/icons-material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useLanguage } from "../../LanguageContext";

const languageOptions = [
  { code: "AR", name: "العربية", value: "ar" },
  { code: "EN", name: "English", value: "en" },
  { code: "FR", name: "Français", value: "fr" }
];

export default function Header1() {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const currentLanguageOption = languageOptions.find(option => option.value === currentLanguage) || languageOptions[1];
  
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, languageValue) => {
    changeLanguage(languageValue);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ 
      bgcolor: "#2B3445",
      py: "4px",
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
    }}>
      <Container>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems="center"
          spacing={{ xs: 1, sm: 0 }}
        >
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Typography
              sx={{
                p: "3px 10px",
                bgcolor: "#D23F57",
                borderRadius: "12px",
                fontSize: { xs: "10px", sm: "12px" },
                fontWeight: "bold",
                color: "#fff",
              }}
              variant="body2"
            >
              {t('discount')}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "10px", sm: "12px" },
                fontWeight: "300",
                color: "#fff",
              }}
              variant="body2"
            >
              {t('dontMissOut')}
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack 
            direction="row" 
            alignItems="center"
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
          >
            <div>
              {theme.palette.mode === "light" ? (
                <IconButton
                  onClick={() => {
                    localStorage.setItem(
                      "mode",
                      theme.palette.mode === "dark" ? "light" : "dark"
                    );
                    colorMode.toggleColorMode();
                  }}
                  color="inherit"
                >
                  <LightModeOutlined sx={{ fontSize: { xs: "14px", sm: "16px" }, color: "#fff" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    localStorage.setItem(
                      "mode",
                      theme.palette.mode === "dark" ? "light" : "dark"
                    );
                    colorMode.toggleColorMode();
                  }}
                  color="inherit"
                >
                  <DarkModeOutlined sx={{ fontSize: { xs: "14px", sm: "16px" } }} />
                </IconButton>
              )}
            </div>

            <List
              component="nav"
              aria-label="Language settings"
              sx={{ p: "0", m: "0" }}
            >
              <ListItemButton
                id="language-button"
                aria-haspopup="listbox"
                aria-controls="language-menu"
                aria-label="language"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickListItem}
                sx={{ 
                  "&:hover": { cursor: "pointer" }, 
                  borderRadius: "12px",
                  minWidth: { xs: "60px", sm: "80px" }
                }}
              >
                <ListItemText
                  sx={{ ".MuiTypography-root": { fontSize: { xs: "12px", sm: "15px" } } }}
                  secondary={currentLanguageOption.code}
                />
                <ExpandMore sx={{ fontSize: { xs: "12px", sm: "15px" }, color: "#fff" }} />
              </ListItemButton>
            </List>

            <FacebookIcon sx={{ color: "#fff", fontSize: { xs: "16px", sm: "20px" } }} />
            <InstagramIcon sx={{ color: "#fff", fontSize: { xs: "16px", sm: "20px" } }} />
          </Stack>
        </Stack>

        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: {
                minWidth: 120,
                bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
              },
            },
          }}
        >
          {languageOptions.map((option) => (
            <MenuItem
              sx={{ 
                fontSize: { xs: "14px", sm: "16px" }, 
                p: "8px 16px", 
                minHeight: "auto",
                direction: option.value === 'ar' ? 'rtl' : 'ltr',
              }}
              key={option.value}
              selected={option.value === currentLanguage}
              onClick={() => handleMenuItemClick(null, option.value)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {option.code}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {option.name}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </Box>
  );
}
