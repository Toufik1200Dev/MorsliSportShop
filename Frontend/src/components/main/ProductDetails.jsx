import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Button, Stack, Typography, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

const API_URL = import.meta.env.VITE_BASE_URL || "https://morsli-sport-shop.onrender.com";

export default function ProductDetails({ product, onClose }) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.selectedSize || product.Product_size || "");
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const hasSize = !!product.Product_size;
  const images = product.Product_img || [];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const imgObj = images[selectedImage];
  const url = imgObj?.formats?.medium?.url || imgObj?.url;
  let imageUrl = '/default-image.png';
  if (url) {
    imageUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 3,
      p: { xs: 1.5, sm: 3 },
      background: '#1a1a2e',
      borderRadius: 3,
      boxShadow: { xs: 'none', md: '0 4px 20px 0 rgba(0,0,0,0.3)' },
      minHeight: { xs: 'auto', md: 340 },
      maxHeight: { xs: '80vh', md: 'none' },
      overflowY: 'auto',
    }}>
      <Box 
        sx={{ 
          width: { xs: '100%', md: '50%' },
          height: { xs: '220px', sm: '300px', md: '400px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          background: '#16213e',
          mb: { xs: 2, md: 0 },
        }}
      >
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={prevImage}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': {
                  background: 'rgba(0,0,0,0.8)',
                }
              }}
            >
              <NavigateBefore />
            </IconButton>
            <IconButton
              onClick={nextImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                '&:hover': {
                  background: 'rgba(0,0,0,0.8)',
                }
              }}
            >
              <NavigateNext />
            </IconButton>
          </>
        )}

        {/* Image thumbnails */}
        {images.length > 1 && (
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 10,
          }}>
            {images.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setSelectedImage(idx)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: selectedImage === idx ? '#e94560' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: selectedImage === idx ? '#e94560' : 'rgba(255,255,255,0.6)',
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* Main zoomable image */}
        <img 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%',
            objectFit: 'contain',
            cursor: 'zoom-in',
            transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
            transition: 'transform 0.3s ease-in-out',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
            background: 'rgba(22,33,62,0.95)'
          }} 
          src={imageUrl}
          alt={product.Product_name}
          onClick={() => setIsZoomed(!isZoomed)}
        />
      </Box>

      <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 1, sm: 2 } }}>
        <Stack spacing={2}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontSize: { xs: '1.3rem', sm: '2rem' },
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.01em',
              mb: 1,
            }}
          >
            {product.Product_name}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
              fontWeight: 800,
              color: '#e94560',
              mb: 1,
            }}
          >
            {product.Product_price} DA
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: '#b8b8b8',
              mb: 1,
            }}
          >
            {product.Product_description}
          </Typography>

          {/* Size and Quantity Selectors */}
          {hasSize && (
            <Box>
              <label htmlFor="size-select" style={{ fontWeight: 500, color: '#fff' }}>Size:</label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                style={{
                  marginLeft: 8,
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #2d3748',
                  fontSize: '1rem',
                  background: '#16213e',
                  color: '#fff',
                }}
              >
                <option value={product.Product_size}>{product.Product_size}</option>
              </select>
            </Box>
          )}
          <Box>
            <label htmlFor="qty-input" style={{ fontWeight: 500, color: '#fff' }}>Quantity:</label>
            <input
              id="qty-input"
              type="text"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={{
                marginLeft: 8,
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #2d3748',
                fontSize: '1rem',
                width: 60,
                background: '#16213e',
                color: '#fff',
              }}
            />
          </Box>

          {/* Show selected size and quantity */}
          {selectedSize && (
            <Typography variant="body1" sx={{ color: '#fff' }}>
              <b>Selected Size:</b> {selectedSize}
            </Typography>
          )}
          {quantity && (
            <Typography variant="body1" sx={{ color: '#fff' }}>
              <b>Quantity:</b> {quantity}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
