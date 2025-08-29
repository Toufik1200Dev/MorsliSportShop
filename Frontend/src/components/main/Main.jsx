import {
  Box,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useGetProductsQuery } from "../../Redux/product";
// @ts-ignore
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {{ VITE_BASE_URL?: string }} ImportMetaEnv
 * @typedef {{ env: ImportMetaEnv }} ImportMeta
 */

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:1337";

function buildImgUrl(rawUrl) {
  if (!rawUrl) return '/default-image.png';
  if (rawUrl.startsWith('http')) return rawUrl;
  return `${API_URL.replace(/\/$/, '')}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

const Main = () => {
  const navigate = useNavigate();

  const handleDetailsClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const { data: productsData, error, isLoading } = useGetProductsQuery();
  
  // Get real products from API
  const allProducts = productsData?.data || [];
  
  // Get all product image URLs
  const allProductImgUrls = allProducts.map(product => {
    // Add null checks to prevent errors
    if (!product || !product.attributes) return null;
    
    const imageUrl = product.attributes.Product_image?.data?.attributes?.url;
    return imageUrl ? `${API_URL}${imageUrl}` : null;
  }).filter(url => url !== null);

  if (error) {
    let errorMsg = "An error occurred while loading products. Please try again later.";
    if (error && typeof error === 'object' && error !== null) {
      if ('status' in error) {
        errorMsg = `Error: ${JSON.stringify(error)}`;
      } else if ('message' in error && typeof error.message === 'string') {
        errorMsg = error.message;
      }
    }
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
        {errorMsg}
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
        Loading products...
      </Typography>
    );
  }

  if (allProducts.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
        No products found!
      </Typography>
    );
  }

  return (
    <Container sx={{ py: 9 }} id="products-section">
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={3}
      >
        <Box>
          <Typography variant="h6">Products </Typography>
          <Typography fontWeight={300} variant="body1">
            All our new arrivals in a exclusive brand selection
          </Typography>
        </Box>
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
        {allProducts.map(product => {
          // Add null checks to prevent errors
          if (!product || !product.attributes) return null;
          
          const rawUrl = product.attributes.Product_image?.data?.attributes?.url;
          const imgUrl = buildImgUrl(rawUrl);
          return (
            <div
              key={product.id}
              id={`product-${product.id}`}
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
                src={imgUrl}
                alt={product.attributes?.Product_name || 'Product'}
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
              }}>{product.attributes?.Product_name || 'Product Name'}</h3>
              <p style={{
                fontSize: '1rem',
                color: '#b8b8b8',
                margin: '0 0 4px 0',
                fontWeight: 500,
                textAlign: 'center',
              }}>{product.attributes?.Product_category || 'Category'}</p>
              <p style={{
                fontSize: '1.1rem',
                color: '#e94560',
                fontWeight: 800,
                margin: '0 0 10px 0',
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}>{product.attributes?.Product_price || '0'} DA</p>
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
                onClick={() => handleDetailsClick(product)}
              >
                Details
              </button>
            </div>
          );
        })}
      </Stack>
    </Container>
  );
};

export default Main;
