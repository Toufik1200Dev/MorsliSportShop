import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container, CircularProgress, Chip, Paper, Slider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useLanguage } from '../LanguageContext';
import { useGetProductsQuery } from '../Redux/product';
// Import hero images directly from src/images
import cardiopicImg from '../images/cardiopic.jpg';
import gymImg from '../images/gym.jpg';
import crossfitImg from '../images/crossfit.jpg';
import judoImg from '../images/judo.jpg';
import kickboxImg from '../images/kickbox.jpg';

// Helper function for image URLs
function buildImgUrl(rawUrl) {
  if (!rawUrl) return '/default-image.png';
  if (rawUrl.startsWith('http')) return rawUrl;
  return rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl;
}

export default function SportHome() {
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Price filter state
  const [priceRange, setPriceRange] = useState([0, 100000]);
  
  // Get products from API - optimized for bandwidth
  const { data: productsData, error, isLoading } = useGetProductsQuery(1, 100, {
    pollingInterval: 300000, // 5 minutes to save bandwidth
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false, // Disable refetch on focus to save bandwidth
    refetchOnReconnect: true,
    // Cache for 5 minutes to reduce API calls
    keepUnusedDataFor: 300,
  });
  
  // Transform products data with useMemo to avoid unnecessary recalculations
  const allProducts = useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];
    return productsData.map(product => {
      if (product.attributes) {
        return {
          id: product.id,
          Product_name: product.attributes.Product_name,
          Product_price: product.attributes.Product_price,
          Product_img: product.attributes.Product_img || [],
          Product_category: product.attributes.Product_category,
        };
      }
      return {
        id: product.id,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_img: product.Product_img || [],
        Product_category: product.Product_category,
      };
    });
  }, [productsData]);
  
  // Get unique categories with useMemo
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(allProducts.map(p => p.Product_category).filter(Boolean)))],
    [allProducts]
  );

  // Calculate price range from all products
  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (allProducts.length === 0) {
      return { minProductPrice: 0, maxProductPrice: 100000 };
    }
    const prices = allProducts.map(p => p.Product_price || 0).filter(p => p > 0);
    if (prices.length === 0) {
      return { minProductPrice: 0, maxProductPrice: 100000 };
    }
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return { minProductPrice: min, maxProductPrice: max };
  }, [allProducts]);

  // Update price range slider when products change
  useEffect(() => {
    if (allProducts.length > 0 && maxProductPrice > minProductPrice) {
      setPriceRange([minProductPrice, maxProductPrice]);
    }
  }, [minProductPrice, maxProductPrice, allProducts.length]);
  
  // Filter and group products with useMemo (includes price filter)
  const productsByCategory = useMemo(() => {
    // First filter by category
    let filtered = selectedCategory === 'all' 
      ? allProducts 
      : allProducts.filter(product => 
      product.Product_category?.toLowerCase() === selectedCategory.toLowerCase()
    );
    
    // Then filter by price range
    filtered = filtered.filter(product => {
      const price = product.Product_price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filtered };
    }
    
    const grouped = {};
    filtered.forEach(product => {
      const category = product.Product_category || 'Autres';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [allProducts, selectedCategory, priceRange]);
  
  // Check if we have actual connection error vs just no products
  // Error exists and we haven't loaded any data yet = connection error
  const hasConnectionError = error && !isLoading && (productsData === undefined || productsData === null);
  // No error, data loaded (even if empty array) and no products = empty database
  // Also check if we successfully got data but it's an empty array
  const hasNoProducts = !isLoading && !error && (
    (productsData !== undefined && Array.isArray(productsData) && productsData.length === 0) ||
    (productsData !== undefined && allProducts.length === 0)
  );
  
  const handleDetailsClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const getImageUrl = (product) => {
    if (!product.Product_img || product.Product_img.length === 0) {
      return '/default-image.png';
    }
    
    const firstImage = product.Product_img[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage?.formats?.medium?.url) {
      return buildImgUrl(firstImage.formats.medium.url);
    } else if (firstImage?.url) {
      return buildImgUrl(firstImage.url);
    }
    return '/default-image.png';
  };

  // Hero slides - using imported images for proper Vite handling
  const heroSlides = [
    {
      image: cardiopicImg,
      text: 'Équipements de cardio',
    },
    {
      image: gymImg,
      text: 'Tout matériel de musclulations',
    },
    {
      image: crossfitImg,
      text: 'Équipements Crossfit & Street workout',
    },
    {
      image: judoImg,
      text: 'Équipements de Judo, Aïkido, Karaté, Taekwondo',
    },
    {
      image: kickboxImg,
      text: 'Kick-Boxing et Boxe Thaï !',
    },
  ];

  return (
        <Box sx={{
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)', 
      minHeight: '100vh', 
            color: '#fff', 
      pb: 0
    }}>
      {/* Hero Section with Slider and Featured Content */}
      <Container maxWidth="xl" sx={{ pt: { xs: 18, md: 20 } }}>
        <Grid container spacing={3} sx={{ mb: { xs: 4, md: 6 } }}>
          {/* Slider - Left 50% */}
          <Grid item xs={12} md={6}>
            <Box sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 212, 255, 0.25)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.4) 0%, rgba(0, 40, 60, 0.3) 50%, rgba(0, 20, 40, 0.4) 100%)',
            }}>
          <Box sx={{ 
                '& .swiper': {
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  borderRadius: '12px',
                },
                '& .swiper-pagination-bullet': {
                  background: '#00d4ff',
                  opacity: 0.5,
                  '&.swiper-pagination-bullet-active': {
                    opacity: 1,
                    background: '#00d4ff',
                  },
                },
                '& .swiper-button-next, & .swiper-button-prev': {
                  color: '#00d4ff',
                  '&:after': {
                    fontSize: '24px',
                  },
                },
          }}>
            <Swiper
              loop={true}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Pagination, Navigation, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <Box sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: { xs: '300px', sm: '400px', md: '500px' },
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#000',
                    }}>
                      <Box
                        component="img"
                      src={slide.image}
                        alt={slide.text}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          objectPosition: 'center center',
                          display: 'block',
                        }}
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                      p: { xs: 2, md: 3 },
                        textAlign: 'center',
                    }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#fff',
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            letterSpacing: '0.5px',
                        }}
                      >
                        {slide.text}
                      </Typography>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
            </Box>
          </Grid>

          {/* Animated Welcome Section - Right 50% */}
          <Grid item xs={12} md={6}>
          <Box sx={{ 
              height: { xs: 'auto', md: '500px' },
            display: 'flex',
            flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.6) 0%, rgba(0, 40, 60, 0.4) 50%, rgba(0, 20, 40, 0.6) 100%)',
              border: '2px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 212, 255, 0.25)',
              backdropFilter: 'blur(10px)',
            }}>
              {/* Animated Background Elements */}
              <Box sx={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 0.6,
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                    opacity: 0.3,
                  },
                },
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: '-30%',
                left: '-15%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 70%)',
                animation: 'float 6s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translateY(0px)',
                  },
                  '50%': {
                    transform: 'translateY(-20px)',
                  },
                },
              }} />

              {/* Welcome Title */}
              <Typography
                variant="h3"
                sx={{
                  color: '#00d4ff',
                  fontWeight: 800,
                  fontFamily: '"Roboto", "Arial", sans-serif',
                  mb: 2,
                  textAlign: 'center',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                  letterSpacing: '1px',
                  position: 'relative',
                  zIndex: 1,
                  animation: 'fadeInDown 1s ease-out',
                  '@keyframes fadeInDown': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(-30px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                }}
              >
                Bienvenue à Morsli Sport Shop
              </Typography>

              {/* Animated Decorative Line */}
              <Box sx={{
                width: '100px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
                mb: 4,
                position: 'relative',
                zIndex: 1,
                animation: 'expand 1.5s ease-out 0.5s both',
                '@keyframes expand': {
                  '0%': {
                    width: '0px',
                    opacity: 0,
                  },
                  '100%': {
                    width: '100px',
                    opacity: 1,
                  },
                },
              }} />

              {/* Animated Features */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '90%',
                position: 'relative', 
                zIndex: 1,
              }}>
                {/* Feature 1 */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  animation: 'slideInLeft 1s ease-out 0.7s both',
                  '@keyframes slideInLeft': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateX(-30px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                    transform: 'translateX(10px)',
                    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2)',
                  },
                }}>
                  <Box sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 184, 212, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(0, 212, 255, 0.4)',
                    animation: 'rotate 3s linear infinite',
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}>
                    <Typography sx={{ fontSize: '24px' }}>⚡</Typography>
                  </Box>
                  <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#fff',
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        mb: 0.5,
                      }}
                    >
                      Livraison Rapide
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        fontFamily: '"Roboto", "Arial", sans-serif',
                      }}
                    >
                      Expédition dans toute l'Algérie
                  </Typography>
                  </Box>
                </Box>

                {/* Feature 2 */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  animation: 'slideInRight 1s ease-out 0.9s both',
                  '@keyframes slideInRight': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateX(30px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                    transform: 'translateX(-10px)',
                    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2)',
                  },
                }}>
                  <Box sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 184, 212, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(0, 212, 255, 0.4)',
                    animation: 'bounce 2s ease-in-out infinite',
                    '@keyframes bounce': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}>
                    <Typography sx={{ fontSize: '24px' }}>⭐</Typography>
              </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        mb: 0.5,
                      }}
                    >
                      Qualité Premium
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        fontFamily: '"Roboto", "Arial", sans-serif',
                      }}
                    >
                      Produits de haute qualité garantis
                    </Typography>
          </Box>
        </Box>

                {/* Feature 3 */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  animation: 'slideInLeft 1s ease-out 1.1s both',
                  '@keyframes slideInLeft': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateX(-30px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                    transform: 'translateX(10px)',
                    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2)',
                  },
                }}>
                  <Box sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 184, 212, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(0, 212, 255, 0.4)',
                    animation: 'pulseIcon 2s ease-in-out infinite',
                    '@keyframes pulseIcon': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.7)',
                      },
                      '50%': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 0 0 10px rgba(0, 212, 255, 0)',
                      },
                    },
                  }}>
                    <Typography sx={{ fontSize: '24px' }}>🎯</Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        fontFamily: '"Roboto", "Arial", sans-serif',
                        mb: 0.5,
                      }}
                    >
                      Large Sélection
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        fontFamily: '"Roboto", "Arial", sans-serif',
                      }}
                    >
                      Des milliers de produits disponibles
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Products Section */}
      <Container maxWidth="xl" id="products-section">
        <Box sx={{ 
          mt: { xs: 4, md: 8 }, 
          px: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 4, md: 8 }
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: '"Roboto", "Arial", sans-serif',
              fontWeight: 700, 
              mb: 4, 
              fontSize: { xs: '2rem', md: '3rem' },
              textAlign: 'center',
              letterSpacing: '0.5px',
              color: '#00d4ff',
            }}
          >
            Nos Produits
          </Typography>

          {/* Filters Section */}
          <Paper sx={{ 
            p: 3, 
            mb: 6, 
            background: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: 3,
          }}>
            {/* Category Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                color: '#00d4ff', 
                mb: 2, 
                fontFamily: '"Roboto", "Arial", sans-serif',
                fontWeight: 600,
              }}>
                Catégories
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 1.5, 
              }}>
                {categories.map(category => (
                  <Chip
                    key={category}
                    label={category === 'all' ? 'Tous' : category}
                    onClick={() => setSelectedCategory(category)}
              sx={{
                      background: selectedCategory === category 
                        ? 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)'
                        : 'rgba(0, 212, 255, 0.1)',
                      color: selectedCategory === category ? '#000' : '#00d4ff',
                fontWeight: 700,
                      fontSize: '0.95rem',
                      px: 1,
                      py: 2.5,
                      border: selectedCategory === category 
                        ? 'none' 
                        : '1px solid rgba(0, 212, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: selectedCategory === category 
                          ? 'linear-gradient(135deg, #00b8d4 0%, #00a8cc 100%)'
                          : 'rgba(0, 212, 255, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Price Filter */}
            <Box>
              <Typography variant="h6" sx={{ 
                color: '#00d4ff', 
                mb: 1.5, 
                fontFamily: '"Roboto", "Arial", sans-serif',
                fontWeight: 600,
              }}>
                Filtrer par Prix (DZD)
              </Typography>
              
              {/* Price Range Slider */}
              <Box sx={{ mb: 3, py: 0, mt: 0 }}>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => {
                    setPriceRange(newValue);
                  }}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value.toLocaleString()} DZD`}
                  min={minProductPrice}
                  max={maxProductPrice}
                  step={Math.max(1, Math.floor((maxProductPrice - minProductPrice) / 100))}
                  sx={{
                    color: '#00d4ff',
                    padding: '0 !important',
                    margin: '0 !important',
                    height: '24px',
                    '& .MuiSlider-root': {
                      padding: '0 !important',
                      margin: '0 !important',
                    },
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#00d4ff',
                      border: '2px solid #000',
                      width: 20,
                      height: 20,
                '&:hover': {
                        boxShadow: '0 0 0 8px rgba(0, 212, 255, 0.16)',
                      },
                      '&.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(0, 212, 255, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#00d4ff',
                      border: 'none',
                      height: 2,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(0, 212, 255, 0.2)',
                      height: 2,
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: '#00d4ff',
                      color: '#000',
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontWeight: 600,
                    },
                  }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 0.5,
                  mb: 0,
                  pt: 0,
                  pb: 0,
                  color: '#94a3b8',
                  fontSize: '0.875rem',
                  fontFamily: '"Roboto", "Arial", sans-serif',
                }}>
                  <span>{priceRange[0].toLocaleString()} DZD</span>
                  <span>{priceRange[1].toLocaleString()} DZD</span>
                </Box>
              </Box>

            </Box>
          </Paper>

          {/* Loading State */}
          {isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#00d4ff' }} size={60} />
              <Typography variant="h6" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: '#94a3b8', mt: 3 }}>
                Chargement des produits...
              </Typography>
            </Box>
          )}

          {/* Connection Error State - Only show if there's an actual connection error */}
          {hasConnectionError && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: '#ef4444', mb: 2 }}>
                Erreur lors du chargement des produits. Veuillez réessayer plus tard.
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: '#94a3b8' }}>
                Vérifiez votre connexion internet ou contactez le support.
              </Typography>
            </Box>
          )}

          {/* No Products State - Show when there are no products in database */}
          {hasNoProducts && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: '#94a3b8', mb: 2 }}>
                Aucun produit disponible pour le moment.
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: '#64748b' }}>
                Revenez bientôt pour découvrir nos produits!
              </Typography>
          </Box>
          )}

          {/* No Products After Filtering */}
          {!isLoading && !hasConnectionError && !hasNoProducts && Object.keys(productsByCategory).length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: '#94a3b8', mb: 2 }}>
                Aucun produit trouvé avec les filtres sélectionnés.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([minProductPrice, maxProductPrice]);
                }}
                sx={{ 
                  background: '#00d4ff',
                  color: '#000',
                  '&:hover': {
                    background: '#00b8d4',
                  },
                }}
              >
                Réinitialiser les filtres
              </Button>
            </Box>
          )}

          {!isLoading && !error && Object.entries(productsByCategory).map(([category, products]) => (
            <Box key={category} sx={{ mb: { xs: 6, md: 10 } }}>
              {/* Category Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                justifyContent: 'center'
              }}>
                <Box sx={{ 
                  flex: 1, 
                  height: '2px', 
                  background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
                  mr: 3
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    fontWeight: 600,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    color: '#00d4ff',
                    textTransform: 'capitalize',
                    textAlign: 'center',
                    minWidth: 'fit-content',
                  }}
                >
                  {category}
          </Typography>
                <Box sx={{ 
                  flex: 1, 
                  height: '2px', 
                  background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)',
                  ml: 3
                }} />
              </Box>

              {/* Products Grid */}
              <Grid 
                container 
                spacing={{ xs: 2, sm: 3, md: 4 }} 
                justifyContent="center"
              >
                {products.map(product => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card 
                      onClick={() => handleDetailsClick(product)}
                      sx={{ 
                        background: '#1a1a1a',
                  color: '#fff', 
                        borderRadius: 3,
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        '&:hover': { 
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 212, 255, 0.3)',
                          borderColor: 'rgba(0, 212, 255, 0.4)',
                        } 
                      }}
                    >
                      <CardMedia 
                        component="img" 
                        image={getImageUrl(product)} 
                        alt={product.Product_name || 'Product'} 
                        sx={{ 
                          objectFit: 'cover',
                          height: { xs: 250, sm: 280, md: 300 },
                          width: '100%',
                          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 184, 212, 0.05) 100%)',
                        }}
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                      />
                      <CardContent sx={{ 
                        p: 3,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              fontWeight: 600, 
                              fontSize: { xs: '1rem', md: '1.15rem' },
                              mb: 1.5,
                              lineHeight: 1.4,
                              minHeight: '2.6em',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              color: '#ffffff'
                            }}
                          >
                            {product.Product_name || 'Product Name'}
                          </Typography>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontFamily: '"Roboto", "Arial", sans-serif',
                              color: '#00d4ff', 
                      fontWeight: 700,
                              fontSize: { xs: '1.3rem', md: '1.5rem' },
                              mb: 2,
                            }}
                          >
                            {product.Product_price?.toLocaleString() || 0} DZD
                    </Typography>
                  </Box>
                        <Button 
                          variant="contained" 
                          size="medium" 
                          fullWidth
                          sx={{ 
                            background: '#00d4ff',
                            color: '#000',
                            fontFamily: '"Roboto", "Arial", sans-serif',
                            fontWeight: 600, 
                            mt: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(0, 212, 255, 0.3)',
                            '&:hover': { 
                              background: '#00b8d4',
                              boxShadow: '0 4px 12px rgba(0, 212, 255, 0.4)',
                              transform: 'translateY(-2px)',
                            } 
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDetailsClick(product);
                          }}
                        >
                          Voir les détails
                        </Button>
                      </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
} 
