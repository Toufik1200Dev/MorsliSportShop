import {
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Close } from "@mui/icons-material";
import ProductDetails from "./ProductDetails";
import { useGetProductsQuery } from "../../Redux/product";
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/cart';
// @ts-ignore
import { useNavigate } from 'react-router-dom';

// @ts-ignore
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:1337";
console.log('API_URL used for backend:', API_URL);

const Main = () => {
  console.log("Main component rendered");
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleClickOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const { data, error, isLoading } = useGetProductsQuery();

  const products = data?.data || [];

  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map(product => product.Product_category).filter(Boolean))
  );
  console.log("Categories from products:", categories);

  const getFilteredProducts = () => {
    if (!products.length) {
      return [];
    }
    if (selectedCategory === "all") {
      return products;
    }
    // Case-insensitive category filter
    return products.filter(product =>
      product.Product_category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const filtered = getFilteredProducts();
  console.log("getFilteredProducts:", filtered);

  let errorMsg = "An error occurred.";
  if (error) {
    if (error && typeof error === 'object' && error !== null) {
      if ('status' in error) {
        errorMsg = `Error: ${JSON.stringify(error)}`;
      } else if ('message' in error && typeof error.message === 'string') {
        errorMsg = error.message;
      }
    }
    return (
      <Typography variant="h6">
        {errorMsg}
      </Typography>
    );
  }

  if (isLoading) {
    return <Typography variant="h6">LOADING..............</Typography>;
  }

  if (products.length === 0) {
    return <Typography>No products found!</Typography>;
  }

  if (data) {
    console.log('Products data:', data);
    return (
      <Container sx={{ py: 9 }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={3}
        >
          <Box>
            <Typography variant="h6">Selected Products</Typography>
            <Typography fontWeight={300} variant="body1">
              All our new arrivals in a exclusive brand selection
            </Typography>
          </Box>

          <ToggleButtonGroup
            color="error"
            value={selectedCategory}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setSelectedCategory(newValue);
              }
            }}
            aria-label="text alignment"
            sx={{
              ".Mui-selected": {
                border: "1px solid rgba(233, 69, 96, 0.5) !important",
                color: "#e94560",
                backgroundColor: "initial",
              },
            }}
          >
            <ToggleButton
              sx={{ color: theme.palette.text.primary }}
              className="myButton"
              value="all"
              aria-label="all products"
            >
              All Products
            </ToggleButton>
            {categories.map((cat) => (
              <ToggleButton
                key={cat}
                sx={{ mx: "16px !important", color: theme.palette.text.primary }}
                className="myButton"
                value={cat}
                aria-label={`${cat} category`}
              >
                {cat}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"center"}
          gap={3}
          sx={{
            '& > *': {
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
              minWidth: { xs: '220px', sm: '260px', md: '300px' },
              maxWidth: { xs: '100%', sm: '360px', md: '400px' },
            }
          }}
        >
          {getFilteredProducts().map((item) => (
            <div
              key={item.id}
              id={`product-${item.id}`}
              style={{
                background: '#1a1a2e',
                borderRadius: '18px',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.3)',
                margin: 8,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
                border: '1.5px solid #16213e',
                cursor: 'pointer',
                minHeight: 340,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(0,0,0,0.4)';
                e.currentTarget.style.border = '1.5px solid #e94560';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px 0 rgba(0,0,0,0.3)';
                e.currentTarget.style.border = '1.5px solid #16213e';
              }}
            >
              <img
                src={item.Product_img && item.Product_img[0] ? `${API_URL}${item.Product_img[0].url}` : '/default-image.png'}
                alt={item.Product_name}
                width={140}
                height={140}
                style={{
                  objectFit: 'cover',
                  borderRadius: '14px',
                  marginBottom: 14,
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.2)',
                  background: '#16213e',
                  border: '1px solid #2d3748',
                  maxWidth: '100%',
                  maxHeight: '140px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 20px 0 rgba(233,69,96,0.3)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.2)';
                }}
              />
              <h3 style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                margin: '0 0 8px 0',
                color: '#fff',
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}>{item.Product_name}</h3>
              <p style={{
                fontSize: '1rem',
                color: '#b8b8b8',
                margin: '0 0 4px 0',
                fontWeight: 500,
                textAlign: 'center',
              }}>{item.Product_category}</p>
              <p style={{
                fontSize: '1.1rem',
                color: '#e94560',
                fontWeight: 800,
                margin: '0 0 10px 0',
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}>{item.Product_price} DA</p>
              <button
                style={{
                  marginTop: 12,
                  background: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 22px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(233,69,96,0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#d7263d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(233,69,96,0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#e94560';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(233,69,96,0.3)';
                }}
                onClick={() => handleClickOpen(item)}
              >
                Details
              </button>
            </div>
          ))}
        </Stack>

        <Dialog
          sx={{
            ".MuiPaper-root": {
              minWidth: { xs: "100%", md: 800 },
              background: '#f8fafc',
              borderRadius: 4,
              p: 2,
              maxHeight: '90vh',
              overflowY: 'auto',
            }
          }}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <IconButton
            sx={{
              ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
              position: "absolute",
              top: 0,
              right: 10,
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>

          <ProductDetails product={selectedProduct} onClose={handleClose} />
        </Dialog>
      </Container>
    );
  }

  return <div style={{color: 'red'}}>DEBUG: Main component is rendering! Filtered products: {JSON.stringify(filtered)}</div>;
};

export default Main;
