import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, TextField, MenuItem, Stack, FormControlLabel, Radio, RadioGroup, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { wilayas, communes } from '../../data/algeria-localities.js';
import { deliveryPricing } from '../../data/delivery-pricing';
import { clearCart } from '../../Redux/cart';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderForm = () => {
  const cartItems = useSelector(({ cart }) => cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    wilayaId: '',
    baladiya: '',
  });
  const [deliveryType, setDeliveryType] = useState('bureau');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const newForm = { ...prevForm, [name]: value };
      if (name === 'wilayaId') {
        newForm.baladiya = '';
      }
      return newForm;
    });
  };

  const handleDeliveryTypeChange = (e) => {
    setDeliveryType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Find the full wilaya object to get its name
    const wilayaObj = wilayas.find(w => w.id === parseInt(form.wilayaId, 10));
    const wilayaName = wilayaObj ? wilayaObj.name : '';
    
    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => acc + (parseInt(item.Product_price) * item.quantity), 0);
    const deliveryPrice = deliveryPricing[wilayaName]?.[deliveryType] || 0;
    const total = subtotal + deliveryPrice;
    
    const orderData = {
      orderDetails: {
        fullName: form.fullName,
        phone: form.phone,
        wilaya: wilayaName,
        baladiya: form.baladiya,
        subtotal: subtotal,
        deliveryType,
        deliveryPrice,
        totalPrice: total,
      },
      cartItems: cartItems,
    };

    try {
      const API_URL = import.meta.env.VITE_BASE_URL || "https://morsli-sport-shop.onrender.com";
      const response = await fetch(`${API_URL}/api/order-submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        dispatch(clearCart());
        setSuccessOpen(true);
        // Optionally, auto-close dialog and redirect after 2s
        setTimeout(() => {
          setSuccessOpen(false);
          navigate('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit order: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the order.');
    }
  };

  const handleDialogClose = () => {
    setSuccessOpen(false);
    navigate('/');
  };

  const filteredCommunes = form.wilayaId
    ? communes.filter(c => c.wilaya_id === parseInt(form.wilayaId, 10))
    : [];

  // Calculate totals for display
  const subtotal = cartItems.reduce((acc, item) => acc + (parseInt(item.Product_price) * item.quantity), 0);
  const selectedWilayaObj = wilayas.find(w => w.id === parseInt(form.wilayaId, 10));
  const selectedWilayaName = selectedWilayaObj ? selectedWilayaObj.name : '';
  const deliveryPrice = deliveryPricing[selectedWilayaName]?.[deliveryType] || 0;
  const total = subtotal + deliveryPrice;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" gutterBottom>Order Form</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Wilaya"
            name="wilayaId"
            value={form.wilayaId}
            onChange={handleChange}
            required
          >
            {wilayas.map(w => (
              <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Baladiya"
            name="baladiya"
            value={form.baladiya}
            onChange={handleChange}
            required
            disabled={!form.wilayaId}
          >
            {filteredCommunes.map(b => (
              <MenuItem key={b.name} value={b.name}>{b.name}</MenuItem>
            ))}
          </TextField>
          <RadioGroup
            row
            value={deliveryType}
            onChange={handleDeliveryTypeChange}
            name="deliveryType"
          >
            <FormControlLabel value="bureau" control={<Radio color="primary" />} label="Bureau" />
            <FormControlLabel value="domicile" control={<Radio color="primary" />} label="Domicile" />
          </RadioGroup>
          <Button type="submit" variant="contained" color="primary">Submit Order</Button>
        </Stack>
      </form>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Order Summary</Typography>
        {cartItems.length === 0 ? (
          <Typography>No items in cart.</Typography>
        ) : (
          <>
            {cartItems.map(item => {
              const itemTotal = (parseInt(item.Product_price) * item.quantity);
              return (
                <Box key={item.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.Product_name}
                  </Typography>
                  <Typography variant="body2">
                    Quantity: {item.quantity} × {item.Product_price} DA = {itemTotal} DA
                  </Typography>
                  {item.selectedSize && (
                    <Typography variant="body2">Size: {item.selectedSize}</Typography>
                  )}
                </Box>
              );
            })}
            <Box sx={{ mt: 3, p: 2, background: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body1">
                <strong>Subtotal:</strong> {subtotal} DA
              </Typography>
              <Typography variant="body1">
                <strong>Delivery ({deliveryType}):</strong> {deliveryPrice} DA
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                <strong>Total:</strong> {total} DA
              </Typography>
            </Box>
          </>
        )}
      </Box>
      <Dialog open={successOpen} onClose={handleDialogClose}>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Order Successful!</Typography>
          <Typography variant="body1">Thank you for your order.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderForm; 