import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../Redux/cart';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, IconButton, TextField, Container, Grid, Paper, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';

// @ts-ignore
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:1337';

const Cart = () => {
  const cartItems = useSelector(
    /** @param {{ cart: { items: any[] } }} state */
    (state) => state.cart.items
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate('/order');
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  // Calculate only subtotal (product prices)
  const subtotal = cartItems.reduce((acc, item) => acc + (parseInt(item.Product_price) * item.quantity), 0);

  if (cartItems.length === 0) {
    return <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>Your cart is empty.</Typography>;
  }

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Your Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cartItems.map(item => (
              <Paper key={item.id + (item.selectedSize || '')} elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px', mr: 2, background: '#eee' }}
                  image={
                    item.Product_img && item.Product_img.length > 0 && item.Product_img[0].url
                      ? `${API_URL}${item.Product_img[0].url}`
                      : '/default-image.png'
                  }
                  alt={item.Product_name}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.Product_name}</Typography>
                  <Typography variant="body1" color="text.secondary">{item.Product_price} DA</Typography>
                  <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                  {item.selectedSize && (
                    <Typography variant="body2" color="text.secondary">Size: {item.selectedSize}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Delivery: {item.deliveryType ? item.deliveryType : 'N/A'}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleRemove(item.id)} color="error" aria-label="Remove item">
                  <DeleteOutline />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Order Summary</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">{subtotal} DA</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                * Delivery costs will be calculated in the order form
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBuyNow}
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => dispatch(clearCart())}
              sx={{ mt: 2 }}
            >
              Clear Cart
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 