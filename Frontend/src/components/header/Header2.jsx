import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  PersonOutlineOutlined,
  Search as SearchIcon,
  Login,
  PersonAdd,
  AccountCircle,
  Settings,
  Logout,
  Favorite
} from "@mui/icons-material";
import {
  Badge,
  Container,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Divider
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../Redux/product";

const Search = styled("div")(({ theme }) => ({
  flexGrow: 0.4,
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #777",
  "&:hover": {
    border: `1px solid ${theme.palette.text.primary}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "266px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#777",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const SearchResults = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
  maxHeight: 300,
  overflow: "auto",
  boxShadow: theme.shadows[4],
  border: `1px solid ${theme.palette.divider}`,
}));

export default function Header2() {
  const cartItems = useSelector(
    /** @param {{ cart: { items: any[] } }} state */
    (state) => state.cart.items
  );
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.data || [];
  
  // User menu functionality
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth system
  
  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.Product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.Product_category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  // Handle search result click
  const handleSearchResultClick = (product) => {
    setSearchQuery("");
    setShowSearchResults(false);
    
    // Navigate to home page and scroll to the product
    navigate("/");
    
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const productElement = document.getElementById(`product-${product.id}`);
      if (productElement) {
        productElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add a highlight effect
        productElement.style.boxShadow = '0 0 20px rgba(233, 69, 96, 0.5)';
        setTimeout(() => {
          productElement.style.boxShadow = '';
        }, 2000);
      }
    }, 100);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
    };

    if (showSearchResults) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSearchResults]);

  return (
    <Container sx={{ my: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
            <img src="/images/MorsliSportLogo.png" alt="Morsli Sport Logo" style={{ height: "50px", width: "100px", objectFit: 'contain' }} />
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
              Morsli Sport
            </Typography>
        </Stack>
      </Link>

      <Box sx={{ position: "relative" }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search products..."
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
          />
        </Search>
        
        {showSearchResults && filteredProducts.length > 0 && (
          <SearchResults onClick={(e) => e.stopPropagation()}>
            <List>
              {filteredProducts.slice(0, 5).map((product) => (
                <ListItem key={product.id} disablePadding>
                  <ListItemButton onClick={() => handleSearchResultClick(product)}>
                    <ListItemText
                      primary={product.Product_name}
                      secondary={`${product.Product_category} - ${product.Product_price} DA`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </SearchResults>
        )}
      </Box>

      <Stack direction={"row"} alignItems={"center"}>
        <IconButton onClick={handleUserMenuOpen}>
          <PersonOutlineOutlined />
        </IconButton>

        <Menu
          anchorEl={userAnchorEl}
          open={Boolean(userAnchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: theme.shadows[3],
            }
          }}
        >
          {!isLoggedIn ? (
            <>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <Favorite fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </>
          )}
        </Menu>

        <Link to="/cart">
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={cartItems ? cartItems.length : 0} color="primary">
              <ShoppingCart />
            </StyledBadge>
          </IconButton>
        </Link>
      </Stack>
    </Container>
  );
}
