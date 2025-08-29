import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Stack,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProductsQuery } from "../../Redux/product";
import { useLanguage } from "../../LanguageContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
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
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.data || [];

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

  // Only show full header on home page
  const isHome = location.pathname === "/";

  return (
    <Container sx={{ my: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Logo + Shop Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexDirection: 'row', gap: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/MorsliSportLogo.png" alt="Logo" style={{ height: 40, marginRight: 8 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>{t('morsliSport')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/AreaSportLogo.jpg" alt="Area Sport Logo" style={{ height: 40, marginRight: 8 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>{t('areaSport')}</Typography>
            </Box>
          </Link>
        </Box>
        {isHome && (
          <>
            {/* Center: Search Bar */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder={t('searchPlaceholder')}
                  inputProps={{ "aria-label": "search" }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
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
              </Search>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
