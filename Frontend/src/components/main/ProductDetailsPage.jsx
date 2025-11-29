import { useState, useEffect } from 'react';
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
  DialogActions,
  Paper,
  Divider,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { 
  NavigateBefore, 
  NavigateNext, 
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { wilayas } from '../../data/algeria-localities.js';
import { deliveryPricing } from '../../data/delivery-pricing';
import { useLanguage } from '../../LanguageContext';
import { getProduct } from '../../api/products';
import { createOrder as createOrderRecord } from '../../api/orders';

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
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
    address: '',
  });
  const [deliveryType, setDeliveryType] = useState('bureau');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(productId);
      if (productData) {
        setProduct(productData);
        if (productData.Product_sizes?.length > 0) {
          setSelectedSize(productData.Product_sizes[0]);
        }
        if (productData.Product_color?.length > 0) {
          setSelectedColor(productData.Product_color[0]);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <CircularProgress sx={{ color: '#00d4ff' }} size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
        minHeight: '100vh',
        pt: { xs: 10, sm: 12 },
      }}>
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Alert 
            severity="error"
            sx={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              mb: 3,
            }}
          >
            {error || 'Product not found'}
          </Alert>
          <Button 
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
              color: '#000',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #00b8d4 0%, #00a8cc 100%)',
              },
            }}
          >
            Retour à l'accueil
          </Button>
        </Container>
      </Box>
    );
  }

  const images = product.Product_img || [];
  const hasSizes = product.Product_sizes && product.Product_sizes.length > 0;
  const hasColors = product.Product_color && product.Product_color.length > 0;

  const nextImage = () => {
    if (images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!form.fullName || !form.phone || !form.wilayaId) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    setSubmitting(true);
    try {
      const wilayaObj = wilayas.find(w => w.id === parseInt(form.wilayaId, 10));
      const wilayaName = wilayaObj ? wilayaObj.name : '';
      
      const itemTotal = parseInt(product.Product_price || 0) * quantity;
      const deliveryPrice = deliveryPricing[wilayaName]?.[deliveryType] || 0;
      const total = itemTotal + deliveryPrice;
      
      const orderData = {
        clientName: form.fullName,
        email: '',
        phone: form.phone,
        address: form.address || `${form.baladiya}, ${wilayaName}`,
        city: form.baladiya,
        wilaya: wilayaName,
        items: [{
          productId: product._id || product.id || productId,
          productName: product.Product_name,
          price: parseFloat(product.Product_price) || 0,
          quantity: parseInt(quantity) || 1,
          size: hasSizes && selectedSize ? selectedSize : undefined,
          color: hasColors && selectedColor ? selectedColor : undefined,
        }],
        total: parseFloat(total) || 0,
        subtotal: parseFloat(itemTotal) || 0,
        deliveryType: deliveryType,
        deliveryPrice: parseFloat(deliveryPrice) || 0,
        status: 'pending',
      };

      await createOrderRecord(orderData);
      setSuccessOpen(true);
      
      setForm({
        fullName: '',
        phone: '',
        wilayaId: '',
        baladiya: '',
        address: '',
      });
      setQuantity(1);
    } catch (err) {
      alert('Échec de la commande: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    return img?.url || img?.formats?.medium?.url || '/default-image.png';
  };

  const currentImage = images[selectedImage] ? getImageUrl(images[selectedImage]) : '/default-image.png';

  // Get delivery prices for selected wilaya
  const getDeliveryPrices = () => {
    if (!form.wilayaId) return { bureau: 0, domicile: 0 };
    const wilayaObj = wilayas.find(w => w.id === parseInt(form.wilayaId, 10));
    const wilayaName = wilayaObj ? wilayaObj.name : '';
    return {
      bureau: deliveryPricing[wilayaName]?.bureau || 0,
      domicile: deliveryPricing[wilayaName]?.domicile || 0,
    };
  };

  const deliveryPrices = getDeliveryPrices();

  // Calculate total price
  const calculateTotal = () => {
    if (!product) return 0;
    const itemTotal = parseInt(product.Product_price || 0) * quantity;
    const wilayaObj = wilayas.find(w => w.id === parseInt(form.wilayaId, 10));
    const wilayaName = wilayaObj ? wilayaObj.name : '';
    const deliveryPrice = deliveryPricing[wilayaName]?.[deliveryType] || 0;
    return itemTotal + deliveryPrice;
  };

  const totalPrice = calculateTotal();
  const itemTotal = product ? parseInt(product.Product_price || 0) * quantity : 0;

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)', 
      minHeight: '100vh', 
      color: '#fff',
      pt: { xs: 10, sm: 12 },
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 4,
            color: '#94a3b8',
            '&:hover': {
              color: '#00d4ff',
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
            },
          }}
        >
          Retour
        </Button>

        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(17, 17, 17, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={prevImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      color: '#00d4ff',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      '&:hover': { 
                        background: 'rgba(0, 212, 255, 0.2)',
                        borderColor: '#00d4ff',
                      }
                    }}
                  >
                    <NavigateBefore />
                  </IconButton>
                  <IconButton
                    onClick={nextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      color: '#00d4ff',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      '&:hover': { 
                        background: 'rgba(0, 212, 255, 0.2)',
                        borderColor: '#00d4ff',
                      }
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                </>
              )}
              <Box
                component="img"
                src={currentImage}
                alt={product.Product_name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: { xs: 400, md: 600 },
                  objectFit: 'contain',
                }}
                loading="lazy"
              />
              {images.length > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  p: 2, 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  background: 'rgba(0, 0, 0, 0.5)',
                }}>
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={getImageUrl(img)}
                      alt={`${product.Product_name} ${idx + 1}`}
                      onClick={() => setSelectedImage(idx)}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: selectedImage === idx ? '2px solid #00d4ff' : '2px solid rgba(0, 212, 255, 0.3)',
                        opacity: selectedImage === idx ? 1 : 0.6,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          opacity: 1,
                          borderColor: '#00d4ff',
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Card>
          </Grid>

          {/* Product Info Section */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #00d4ff 0%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                {product.Product_name}
              </Typography>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#00d4ff', 
                  fontWeight: 800,
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                }}
              >
                {product.Product_price?.toLocaleString()} DZD
              </Typography>

              {product.Product_desctiption && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#94a3b8',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                  }}
                >
                  {product.Product_desctiption}
                </Typography>
              )}

              <Divider sx={{ borderColor: 'rgba(0, 212, 255, 0.2)' }} />

              {/* Sizes */}
              {hasSizes && (
                <Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: '#00d4ff',
                      mb: 2,
                    }}
                  >
                    Tailles Disponibles:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {product.Product_sizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        onClick={() => setSelectedSize(size)}
                        sx={{
                          background: selectedSize === size 
                            ? 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)'
                            : 'rgba(0, 212, 255, 0.1)',
                          color: selectedSize === size ? '#000' : '#00d4ff',
                          fontWeight: 700,
                          border: selectedSize === size 
                            ? 'none' 
                            : '1px solid rgba(0, 212, 255, 0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: selectedSize === size 
                              ? 'linear-gradient(135deg, #00b8d4 0%, #00a8cc 100%)'
                              : 'rgba(0, 212, 255, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Colors */}
              {hasColors && (
                <Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: '#00d4ff',
                      mb: 2,
                    }}
                  >
                    Couleurs Disponibles:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {product.Product_color.map((color, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: selectedColor === color 
                            ? '3px solid #00d4ff' 
                            : '2px solid rgba(0, 212, 255, 0.3)',
                          cursor: 'pointer',
                          boxShadow: selectedColor === color 
                            ? '0 0 20px rgba(0, 212, 255, 0.6)' 
                            : '0 0 10px rgba(0, 212, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 0 25px rgba(0, 212, 255, 0.5)',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Quantity */}
              <Box>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    color: '#00d4ff',
                    mb: 2,
                  }}
                >
                  Quantité:
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    sx={{
                      borderColor: 'rgba(0, 212, 255, 0.3)',
                      color: '#00d4ff',
                      minWidth: 50,
                      '&:hover': {
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                      },
                      '&.Mui-disabled': {
                        borderColor: 'rgba(0, 212, 255, 0.1)',
                        color: 'rgba(0, 212, 255, 0.3)',
                      },
                    }}
                  >
                    -
                  </Button>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#ffffff',
                      fontWeight: 700,
                      minWidth: 50,
                      textAlign: 'center',
                    }}
                  >
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setQuantity(quantity + 1)}
                    sx={{
                      borderColor: 'rgba(0, 212, 255, 0.3)',
                      color: '#00d4ff',
                      minWidth: 50,
                      '&:hover': {
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                      },
                    }}
                  >
                    +
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Order Form Section */}
        <Card sx={{ 
          mt: 6,
          background: 'rgba(17, 17, 17, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                mb: 4,
                background: 'linear-gradient(135deg, #00d4ff 0%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Passer une Commande
            </Typography>
            
            <form onSubmit={handleSubmitOrder}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom Complet *"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(26, 26, 26, 0.8)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94a3b8',
                        '&.Mui-focused': {
                          color: '#00d4ff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Téléphone *"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(26, 26, 26, 0.8)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94a3b8',
                        '&.Mui-focused': {
                          color: '#00d4ff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Wilaya *"
                    name="wilayaId"
                    value={form.wilayaId}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(26, 26, 26, 0.8)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94a3b8',
                        '&.Mui-focused': {
                          color: '#00d4ff',
                        },
                      },
                    }}
                  >
                    {wilayas.map((wilaya) => (
                      <MenuItem 
                        key={wilaya.id} 
                        value={wilaya.id}
                        sx={{
                          backgroundColor: 'rgba(17, 17, 17, 0.95)',
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 212, 255, 0.1)',
                          },
                        }}
                      >
                        {wilaya.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Commune/Baladiya"
                    name="baladiya"
                    value={form.baladiya}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(26, 26, 26, 0.8)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94a3b8',
                        '&.Mui-focused': {
                          color: '#00d4ff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse Complète"
                    name="address"
                    multiline
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(26, 26, 26, 0.8)',
                        color: '#ffffff',
                        '& fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(0, 212, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00d4ff',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#94a3b8',
                        '&.Mui-focused': {
                          color: '#00d4ff',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: '#00d4ff',
                      mb: 2,
                    }}
                  >
                    Type de Livraison:
                  </Typography>
                  <RadioGroup
                    name="deliveryType"
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                  >
                    <FormControlLabel 
                      value="bureau" 
                      control={
                        <Radio 
                          sx={{
                            color: '#94a3b8',
                            '&.Mui-checked': {
                              color: '#00d4ff',
                            },
                          }}
                        />
                      } 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: '#ffffff' }}>Bureau de Poste</Typography>
                          {deliveryPrices.bureau > 0 && (
                            <Chip 
                              label={`${deliveryPrices.bureau.toLocaleString()} DZD`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                                color: '#00d4ff',
                                fontWeight: 700,
                                border: '1px solid rgba(0, 212, 255, 0.4)',
                              }}
                            />
                          )}
                        </Box>
                      }
                      sx={{ mb: 1 }}
                    />
                    <FormControlLabel 
                      value="domicile" 
                      control={
                        <Radio 
                          sx={{
                            color: '#94a3b8',
                            '&.Mui-checked': {
                              color: '#00d4ff',
                            },
                          }}
                        />
                      } 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ color: '#ffffff' }}>Domicile</Typography>
                          {deliveryPrices.domicile > 0 && (
                            <Chip 
                              label={`${deliveryPrices.domicile.toLocaleString()} DZD`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                                color: '#00d4ff',
                                fontWeight: 700,
                                border: '1px solid rgba(0, 212, 255, 0.4)',
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Grid>
                
                {/* Total Price Section */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      background: 'rgba(0, 212, 255, 0.1)',
                      border: '2px solid rgba(0, 212, 255, 0.3)',
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#94a3b8', 
                            mb: 0.5,
                            fontSize: '0.9rem',
                          }}
                        >
                          Sous-total ({quantity} {quantity > 1 ? 'articles' : 'article'})
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '1rem',
                          }}
                        >
                          {itemTotal.toLocaleString()} DZD
                        </Typography>
                      </Box>
                      {form.wilayaId && (
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#94a3b8', 
                              mb: 0.5,
                              fontSize: '0.9rem',
                            }}
                          >
                            Livraison
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#00d4ff',
                              fontWeight: 600,
                              fontSize: '1rem',
                            }}
                          >
                            {deliveryPrices[deliveryType]?.toLocaleString() || '0'} DZD
                          </Typography>
                        </Box>
                      )}
                      <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(0, 212, 255, 0.3)', display: { xs: 'none', sm: 'block' } }} />
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#94a3b8', 
                            mb: 0.5,
                            fontSize: '0.9rem',
                          }}
                        >
                          Total
                        </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            background: 'linear-gradient(135deg, #00d4ff 0%, #ffffff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontWeight: 800,
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                          }}
                        >
                          {totalPrice.toLocaleString()} DZD
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting}
                    sx={{
                      py: 2,
                      background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0, 212, 255, 0.5)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #00b8d4 0%, #00a8cc 100%)',
                        boxShadow: '0 6px 30px rgba(0, 212, 255, 0.7)',
                        transform: 'translateY(-2px)',
                      },
                      '&.Mui-disabled': {
                        background: 'rgba(0, 212, 255, 0.3)',
                        color: 'rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} sx={{ color: '#000' }} />
                    ) : (
                      'Passer la Commande'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog 
          open={successOpen} 
          onClose={() => setSuccessOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(17, 17, 17, 0.98)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.2)',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)',
              color: '#fff',
              fontWeight: 800,
              py: 2.5,
              px: 3,
              borderBottom: '2px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle sx={{ color: '#10b981', fontSize: 40 }} />
              <Typography sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 800,
              }}>
                Commande Enregistrée!
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3, backgroundColor: '#0a0a0a' }}>
            <Typography sx={{ color: '#e2e8f0', fontSize: '1.1rem' }}>
              Votre commande a été enregistrée avec succès. Nous vous contacterons bientôt!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(16, 185, 129, 0.1)', backgroundColor: '#0a0a0a' }}>
            <Button 
              onClick={() => { setSuccessOpen(false); navigate('/'); }}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 800,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default ProductDetailsPage;
