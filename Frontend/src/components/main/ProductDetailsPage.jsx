import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack, 
  TextField, 
  MenuItem, 
  FormControlLabel, 
  Radio, 
  RadioGroup,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import { 
  NavigateBefore, 
  NavigateNext, 
  CheckCircle,
  ArrowBack,
  LocalShipping,
  Payment,
  Security
} from '@mui/icons-material';
import { wilayas } from '../../data/algeria-localities.js';
import { deliveryPricing } from '../../data/delivery-pricing';
import { useLanguage } from '../../LanguageContext';
import { useGetProductsQuery } from '../../Redux/product';

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:1337";

function buildImgUrl(rawUrl) {
  if (!rawUrl) return '/default-image.png';
  if (rawUrl.startsWith('http')) return rawUrl;
      return `${API_URL.replace(/\/$/, '')}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

// Helper to guarantee translation is a string
function safeT(val, fallback) {
  return typeof val === 'string' && val.trim() ? val : fallback;
}

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  
  // Use the existing Redux query to get all products
  const { data: productsData, error, isLoading } = useGetProductsQuery();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  
  // Order form state
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    wilayaId: '',
    baladiya: '',
  });
  const [deliveryType, setDeliveryType] = useState('bureau');

  // Find the specific product from the products data
  const products = productsData?.data || [];
  const product = products.find(
    p => p.id === productId || p.id === Number(productId) || p.id.toString() === productId
  );

  // Set selected size and color when product is found
  useEffect(() => {
    if (product && Array.isArray(product.Product_sizes) && product.Product_sizes.length > 0) {
      setSelectedSize(product.Product_sizes[0]); // default to first size
    } else {
      setSelectedSize("");
    }
    if (product && Array.isArray(product.Product_color) && product.Product_color.length > 0) {
      setSelectedColor(product.Product_color[0]); // default to first color
    } else {
      setSelectedColor("");
    }
  }, [product]);

  const nextImage = () => {
    if (product?.Product_img) {
      setSelectedImage((prev) => (prev + 1) % product.Product_img.length);
    }
  };

  const prevImage = () => {
    if (product?.Product_img) {
      setSelectedImage((prev) => (prev - 1 + product.Product_img.length) % product.Product_img.length);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const newForm = { ...prevForm, [name]: value };
      return newForm;
    });
  };

  const handleDeliveryTypeChange = (e) => {
    setDeliveryType(e.target.value);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Validate quantity
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity (minimum 1)');
      return;
    }
    
    const wilayaObj = wilayas.find(w => w.id === parseInt(form.wilayaId, 10));
    const wilayaName = wilayaObj ? wilayaObj.name : '';
    
    const itemTotal = parseInt(product.Product_price) * (parseInt(String(quantity)) || 1);
    const deliveryPrice = deliveryPricing[wilayaName]?.[deliveryType] || 0;
    const total = itemTotal + deliveryPrice;
    
    const orderData = {
      orderDetails: {
        fullName: form.fullName,
        phone: form.phone,
        wilaya: wilayaName,
        baladiya: form.baladiya,
        subtotal: itemTotal,
        deliveryType,
        deliveryPrice,
        totalPrice: total,
      },
      cartItems: [{
        ...product,
        selectedSize: hasSizes ? selectedSize : undefined,
        selectedColor: selectedColor || undefined,
        quantity: parseInt(String(quantity)) || 1,
      }],
    };

    try {
      const response = await fetch(`${API_URL.replace(/\/$/, '')}/api/order-submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const text = await response.text();
        alert(`Failed to submit order: ${text}`);
        return;
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate('/');
      }, 2000);
    } catch (error) {
      // Submission error occurred
      alert('An error occurred while submitting the order.');
    }
  };

  const handleDialogClose = () => {
    setSuccessOpen(false);
    navigate('/');
  };

  const hasSizes = Array.isArray(product?.Product_sizes) && product.Product_sizes.length > 0;
  const images = product?.Product_img || [];
  const imgObj = images[selectedImage];
  const url = imgObj?.formats?.medium?.url || imgObj?.url;
  let imageUrl = buildImgUrl(url);

  const productOptionsLabel = safeT(t('productOptions'), currentLanguage === 'ar' ? 'خيارات المنتج' : 'Product Options');
  const sizeLabel = safeT(t('size'), currentLanguage === 'ar' ? 'المقاس' : 'Size');
  const selectedSizeLabel = safeT(t('selectedSize'), currentLanguage === 'ar' ? 'المقاس المختار' : 'Selected Size');
  const quantityLabel = safeT(t('quantity'), currentLanguage === 'ar' ? 'الكمية' : 'Quantity');

  const orderSummarySelectedSizeLabel = t('selectedSize');
  const orderSummaryQuantityLabel = t('quantity');

  if (error) {
    return (
      <Container sx={{ py: 9 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          Error loading products. Please try again later.
        </Typography>
        <Button onClick={() => navigate('/')} variant="contained" sx={{ display: 'block', mx: 'auto' }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container sx={{ py: 9 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          Loading product...
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 9 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          Product not found
        </Typography>
        <Button onClick={() => navigate('/')} variant="contained" sx={{ display: 'block', mx: 'auto' }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            mb: 3,
            color: '#fff',
            '&:hover': {
              background: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Product Details Section */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={8} sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              p: 4,
              height: 'fit-content'
            }}>
              {/* Product Image Section */}
              <Box 
                sx={{ 
                  width: '100%',
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 3,
                  background: 'rgba(0,0,0,0.4)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  mb: 3,
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
                        background: 'rgba(0,0,0,0.8)',
                        color: '#fff',
                        '&:hover': {
                          background: 'rgba(0,0,0,0.9)',
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
                        background: 'rgba(0,0,0,0.8)',
                        color: '#fff',
                        '&:hover': {
                          background: 'rgba(0,0,0,0.9)',
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
                          background: selectedImage === idx ? '#10b981' : 'rgba(255,255,255,0.4)',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          '&:hover': {
                            background: selectedImage === idx ? '#10b981' : 'rgba(255,255,255,0.6)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Main zoomable image */}
                <img 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'zoom-in',
                    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 2,
                  }} 
                  src={imageUrl}
                  alt={product.Product_name}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </Box>

              {/* Product Info */}
              <Stack spacing={3}>
                <Box>
                  <Chip 
                    label={currentLanguage === 'ar' && product.Product_category_ar ? product.Product_category_ar : product.Product_category} 
                    sx={{ 
                      background: 'rgba(16,185,129,0.2)', 
                      color: '#10b981',
                      fontWeight: 600,
                      mb: 2
                    }} 
                  />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '0.01em',
                      mb: 1,
                    }}
                  >
                    {currentLanguage === 'ar' && product.Product_name_ar ? product.Product_name_ar : product.Product_name}
                  </Typography>
                  
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 800,
                      color: '#f59e0b',
                      mb: 2,
                    }}
                  >
                    {product.Product_price} DA
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    color: '#e5e7eb',
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  {currentLanguage === 'ar' && product.Product_desctiption_ar ? product.Product_desctiption_ar : product.Product_desctiption}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Order Form Section */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={8} sx={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              p: 4,
              height: 'fit-content'
            }}>
              <Typography variant="h4" sx={{ 
                color: '#fff', 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Payment sx={{ color: '#10b981' }} />
                {t('orderForm')}
              </Typography>
              
              <form onSubmit={handleSubmitOrder}>
                <Stack spacing={3}>
                  <TextField
                    label={t('fullName')}
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#e5e7eb',
                      },
                    }}
                  />
                  
                  <TextField
                    label={t('phoneNumber')}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#e5e7eb',
                      },
                    }}
                  />
                  
                  <TextField
                    select
                    label={t('wilaya')}
                    name="wilayaId"
                    value={form.wilayaId}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#e5e7eb',
                      },
                    }}
                  >
                    {wilayas.map(w => (
                      <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                    ))}
                  </TextField>
                  
                  <TextField
                    label={t('baladiya')}
                    name="baladiya"
                    value={form.baladiya}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#e5e7eb',
                      },
                    }}
                  />
                  
                  <Box>
                    <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                      Delivery Type:
                    </Typography>
                    <RadioGroup
                      row
                      value={deliveryType}
                      onChange={handleDeliveryTypeChange}
                      name="deliveryType"
                    >
                      <FormControlLabel 
                        value="bureau" 
                        control={<Radio sx={{ color: '#10b981' }} />} 
                        label={t('bureau')} 
                        sx={{ color: '#fff' }}
                      />
                      <FormControlLabel 
                        value="domicile" 
                        control={<Radio sx={{ color: '#10b981' }} />} 
                        label={t('domicile')} 
                        sx={{ color: '#fff' }}
                      />
                    </RadioGroup>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                  {/* Size and Color Selectors Row */}
                  {(hasSizes || (Array.isArray(product?.Product_color) && product.Product_color.length > 0)) && (
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      {hasSizes && (
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#fff', mb: 1 }}>
                            {sizeLabel}
                          </Typography>
                          <TextField
                            select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': {
                                  borderColor: 'rgba(255,255,255,0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#10b981',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#10b981',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#e5e7eb',
                              },
                            }}
                          >
                            {product.Product_sizes.map(size => (
                              <MenuItem key={size} value={size}>{size}</MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      )}
                      {Array.isArray(product?.Product_color) && product.Product_color.length > 0 && (
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#fff', mb: 1 }}>
                            {t('color') || (currentLanguage === 'ar' ? 'اللون' : 'Color')}
                          </Typography>
                          <TextField
                            select
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': {
                                  borderColor: 'rgba(255,255,255,0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#10b981',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#10b981',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#e5e7eb',
                              },
                            }}
                          >
                            {product.Product_color.map(color => (
                              <MenuItem key={color} value={color}>
                                <span style={{
                                  display: 'inline-block',
                                  width: 18,
                                  height: 18,
                                  borderRadius: '50%',
                                  background: color.toLowerCase(),
                                  border: '1px solid #ccc',
                                  marginRight: 8,
                                  verticalAlign: 'middle',
                                }} />
                                {t(color.toLowerCase()) || color}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                      )}
                    </Box>
                  )}
                  {/* Quantity Selector */}
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#fff', mb: 1 }}>
                      {quantityLabel}
                    </Typography>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setQuantity(1); // Default to 1 if empty
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue > 0) {
                            setQuantity(numValue);
                          }
                        }
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#10b981',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#10b981',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#e5e7eb',
                        },
                      }}
                    />
                  </Box>
                  
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                  {/* Order Summary */}
                  <Box sx={{ 
                    p: 3, 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: 2, 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  }}>
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                      {t('orderSummary')}
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                        {product.Product_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                        {orderSummaryQuantityLabel}: {quantity} × {product.Product_price} DA = {parseInt(product.Product_price) * (parseInt(String(quantity)) || 1)} DA
                      </Typography>
                      {selectedSize && (
                        <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                          {orderSummarySelectedSizeLabel}: {selectedSize}
                        </Typography>
                      )}
                      {selectedColor && (
                        <Typography variant="body2" sx={{ color: '#e5e7eb', display: 'flex', alignItems: 'center' }}>
                          {t('color') || (currentLanguage === 'ar' ? 'اللون' : 'Color')}: {t(selectedColor.toLowerCase()) || selectedColor}
                          <span style={{
                            display: 'inline-block',
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: selectedColor.toLowerCase(),
                            border: '1px solid #ccc',
                            marginLeft: 6,
                            verticalAlign: 'middle',
                          }} />
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ p: 2, background: 'rgba(16,185,129,0.1)', borderRadius: 1, border: '1px solid rgba(16,185,129,0.3)' }}>
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        <strong>{t('subtotal')}:</strong> {parseInt(product.Product_price) * (parseInt(String(quantity)) || 1)} DA
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        <strong>{t('delivery')} ({t(deliveryType)}):</strong> {deliveryPricing[wilayas.find(w => w.id === parseInt(form.wilayaId, 10))?.name]?.[deliveryType] || 0} DA
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                        <strong>{t('total')}:</strong> {(parseInt(product.Product_price) * (parseInt(String(quantity)) || 1)) + (deliveryPricing[wilayas.find(w => w.id === parseInt(form.wilayaId, 10))?.name]?.[deliveryType] || 0)} DA
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      textTransform: 'capitalize',
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669 0%, #047857 100%)',
                      }
                    }}
                  >
                    {t('submitOrder')}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
                height: '100%'
              }}>
                <LocalShipping sx={{ fontSize: 40, color: '#10b981', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                  Quick and reliable delivery across Algeria
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
                height: '100%'
              }}>
                <Payment sx={{ fontSize: 40, color: '#f59e0b', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                  Secure Payment
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                  Safe and secure payment methods
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 3,
                textAlign: 'center',
                height: '100%'
              }}>
                <Security sx={{ fontSize: 40, color: '#3b82f6', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                  Quality Guarantee
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb' }}>
                  High-quality products with warranty
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog open={successOpen} onClose={handleDialogClose}>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          <CheckCircle sx={{ fontSize: 60, mb: 1, color: '#10b981' }} />
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{t('orderSuccess')}</Typography>
          <Typography variant="body1">{t('thankYouForOrder')}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 