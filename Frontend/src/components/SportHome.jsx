import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, Grid, Card, CardContent, CardMedia, Avatar, Rating, Container } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useLanguage } from '../LanguageContext';
import { getTranslation } from '../translations';
import { useGetProductsQuery } from '../Redux/product';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

const API_URL = (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_BASE_URL) ? import.meta.env.VITE_BASE_URL : "https://morsli-sport-shop.onrender.com";

function buildImgUrl(rawUrl) {
  if (!rawUrl) return '/default-image.png';
  if (rawUrl.startsWith('http')) return rawUrl;
  return `${API_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

const reviews = [
  {
    name: 'Yacine B.',
    rating: 5,
    comment: 'Super produits, livraison rapide et service client au top!'
  },
  {
    name: 'Sarah L.',
    rating: 4,
    comment: "J'ai trouvé tout ce qu'il me fallait pour la salle de sport."
  },
  {
    name: 'Mehdi K.',
    rating: 5,
    comment: 'Qualité excellente, je recommande vivement.'
  },
];

const whyChoose = [
  { icon: <DirectionsRunIcon fontSize="large" sx={{ color: '#10b981' }} />, label: 'Livraison Express' },
  { icon: <FitnessCenterIcon fontSize="large" sx={{ color: '#3b82f6' }} />, label: 'Matériel Pro' },
  { icon: <SportsMmaIcon fontSize="large" sx={{ color: '#f59e0b' }} />, label: 'Paiement Sécurisé' },
  { icon: <SportsSoccerIcon fontSize="large" sx={{ color: '#2196f3' }} />, label: 'Conseils Experts' },
];

const heroSlides = [
  {
    image: '/images/cardiopic.jpg',
    text: 'Équipements de cardio',
  },
  {
    image: '/images/gym.jpg',
    text: 'Tout matériel de musclulations',
  },
  {
    image: '/images/crossfit.jpg',
    text: 'Équipements Crossfit & Street workout',
  },
  {
    image: '/images/judo.jpg',
    text: 'Équipements de Judo, Aïkido, Karaté, Taekwondo',
  },
  {
    image: '/images/kickbox.jpg',
    text: 'Kick-Boxing et Boxe Thaï !',
  },
];

const additionalSlides = [
  {
    image: '/images/football.jpg',
    text: 'Équipements de Football',
  },
  {
    image: '/images/stade.jpg',
    text: 'Équipements de Stade',
  },
];

// Helper to guarantee translation is a string
function safeT(val, fallback) {
  return typeof val === 'string' && val.trim() ? val : fallback;
}

export default function SportHome() {
  const navigate = useNavigate();
  const { currentLanguage, t } = useLanguage();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get products with pagination
  const { data: productsData, error, isLoading } = useGetProductsQuery(currentPage);
  
  // Update products when data changes
  useEffect(() => {
    if (productsData?.data) {
      if (currentPage === 1) {
        setAllProducts(productsData.data);
      } else {
        setAllProducts(prev => [...prev, ...productsData.data]);
      }
      
      // Check if there are more products
      const totalPages = Math.ceil((productsData.meta?.pagination?.total || 0) / 8);
      setHasMore(currentPage < totalPages);
    }
  }, [productsData, currentPage]);
  
  // Load more products
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }
  };
  
  // Filter products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return allProducts;
    }
    return allProducts.filter(product => 
      product.Product_category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  };
  
  const featuredProducts = getFilteredProducts();
  
  // Get all product image URLs for the slider
  const allProductImgUrls = featuredProducts.map(product => {
    if (!product || !product.attributes) return null;
    
    const imageUrl = product.attributes.Product_image?.data?.attributes?.url;
    return imageUrl ? `https://morsli-sport-shop.onrender.com${imageUrl}` : null;
  }).filter(url => url !== null);
  
  const handleDetailsClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #181818 0%, #111 100%)', minHeight: '100vh', color: '#fff' }}>
      {/* Hero Section */}
      <Container maxWidth="xl">
        <Box sx={{
          py: { xs: 4, md: 10 },
          px: { xs: 1, md: 2 },
          textAlign: 'center',
          background: 'linear-gradient(120deg, #1976d2 0%, #181818 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 2, md: 3 },
          mt: { xs: 1, md: 2 },
        }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 900, 
            mb: { xs: 1, md: 2 }, 
            letterSpacing: 1, 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '3.5rem' } 
          }}>
            Unleash Your <span style={{ color: '#2196f3' }}>Sport</span> Potential
          </Typography>
          <Typography variant="h5" sx={{ 
            mb: { xs: 2, md: 4 }, 
            fontWeight: 400, 
            color: '#fff', 
            opacity: 0.9,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }
          }}>
            Boutique d'équipement sportif moderne, pour tous les passionnés
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.2rem' },
              px: { xs: 3, md: 5 },
              py: { xs: 1, md: 1.5 },
              borderRadius: 3,
              boxShadow: '0 4px 15px rgba(16,185,129,0.2)',
              '&:hover': { background: 'linear-gradient(45deg, #059669 0%, #047857 100%)', color: '#fff' },
            }}
            onClick={() => {
              const productsSection = document.getElementById('products-section');
              if (productsSection) {
                productsSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
          >
            Shop Now
          </Button>
          {/* Animated sport icons - hidden on mobile */}
          <Box sx={{ 
            position: 'absolute', 
            top: { xs: 10, md: 30 }, 
            right: { xs: 10, md: 40 }, 
            opacity: { xs: 0.05, md: 0.15 } 
          }}>
            <SportsSoccerIcon sx={{ fontSize: { xs: 60, md: 120 }, color: '#1976d2' }} />
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            bottom: { xs: 10, md: 30 }, 
            left: { xs: 10, md: 40 }, 
            opacity: { xs: 0.05, md: 0.13 } 
          }}>
            <FitnessCenterIcon sx={{ fontSize: { xs: 50, md: 100 }, color: '#2196f3' }} />
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            top: { xs: 40, md: 80 }, 
            left: { xs: 40, md: 80 }, 
            opacity: { xs: 0.05, md: 0.10 } 
          }}>
            <SportsMmaIcon sx={{ fontSize: { xs: 40, md: 80 }, color: '#1976d2' }} />
          </Box>
        </Box>
      </Container>

      {/* Image Slider Section */}
      <Container maxWidth="xl" sx={{
        py: { xs: 3, md: 6 },
        px: { xs: 1, md: 0 },
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        width: '100%'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: { xs: 2, md: 4 }, 
          color: '#2196f3', 
          textAlign: 'center', 
          px: 2,
          fontSize: { xs: '1.5rem', md: '2rem' }
        }}>
          Nos Équipements Sportifs
        </Typography>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 2, md: 3 },
          px: { xs: 1, md: 2 }
        }}>
          {/* Main Slider - Left Side */}
          <Box sx={{ 
            flex: { lg: '1 1 60%' },
            maxWidth: { xs: '100%', lg: 'calc(60% - 200px)' },
          }}>
            <Swiper
              loop={true}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Pagination, Navigation, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              style={{ borderRadius: '16px', overflow: 'hidden', height: '320px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <Box sx={{ position: 'relative', width: '100%', height: { xs: '200px', sm: '240px', md: '320px' }, p: 0, m: 0 }}>
                    <img
                      src={slide.image}
                      alt="Sport Equipment"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', padding: 0, margin: 0 }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      p: { xs: 2, md: 3 },
                      textAlign: 'center'
                    }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#fff',
                          fontWeight: 700,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
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

          {/* Additional Slides - Right Side */}
          <Box sx={{ 
            flex: { lg: '1 1 40%' },
            maxWidth: { lg: '40%' },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, md: 2 }
          }}>
            {additionalSlides.map((slide, index) => (
              <Box key={index} sx={{ 
                position: 'relative', 
                height: { xs: '120px', sm: '150px', md: '190px' },
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.3)'
              }}>
                <img 
                  src={slide.image} 
                  alt="Sport Equipment" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  p: { xs: 1, md: 2 },
                  textAlign: 'center'
                }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      fontSize: { xs: '0.8rem', sm: '1rem', md: '1.1rem' }
                    }}
                  >
                    {slide.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Pourquoi nous choisir ? */}
      <Container maxWidth="xl">
        <Box sx={{ mt: { xs: 4, md: 8 }, px: { xs: 1, md: 2 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: { xs: 2, md: 3 }, color: '#10b981', fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: 'center', letterSpacing: 1 }}>
            Pourquoi nous choisir ?
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {whyChoose.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    textAlign: 'center',
                    boxShadow: '0 6px 32px 0 rgba(16,185,129,0.10)',
                    color: '#fff',
                    minHeight: { xs: 140, md: 180 },
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.04)',
                      boxShadow: `0 12px 40px 0 #10b98155`,
                    },
                    animation: `fadeInUp 0.7s ${0.1 * idx + 0.2}s both`,
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
                      to: { opacity: 1, transform: 'none' },
                    },
                  }}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {React.cloneElement(item.icon, {
                      sx: { fontSize: 48, color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }
                    })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.25rem' }, letterSpacing: 0.5, mb: 1, textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Produits */}
      <Container maxWidth="xl" id="products-section">
        <Box sx={{ mt: { xs: 4, md: 8 }, px: { xs: 1, md: 2 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: { xs: 2, md: 3 }, color: '#2196f3', fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Produits
          </Typography>
          <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 2, mb: 3, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { background: '#2196f3', borderRadius: 2 } }}>
            <Button
              variant={selectedCategory === 'all' ? 'contained' : 'outlined'}
              sx={{
                background: selectedCategory === 'all' ? 'linear-gradient(45deg, #10b981 0%, #059669 100%)' : 'rgba(59,130,246,0.08)',
                color: selectedCategory === 'all' ? '#fff' : '#3b82f6',
                borderColor: selectedCategory === 'all' ? '#10b981' : '#3b82f6',
                fontWeight: 700,
                minWidth: 120,
                '&:hover': {
                  background: selectedCategory === 'all' ? 'linear-gradient(45deg, #059669 0%, #047857 100%)' : 'rgba(59,130,246,0.15)',
                  color: '#fff',
                },
              }}
              onClick={() => setSelectedCategory('all')}
            >
              {safeT(t('all'), currentLanguage === 'ar' ? 'الكل' : 'Tous')}
            </Button>
            {Array.from(new Set(allProducts.map(p => p.Product_category).filter(Boolean))).map(cat => {
              // Find a product with this category to get the Arabic name
              const prodWithCat = allProducts.find(p => p.Product_category === cat);
              const catLabel = currentLanguage === 'ar' && prodWithCat && prodWithCat.Product_category_ar ? prodWithCat.Product_category_ar : cat;
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setSelectedCategory(cat)}
                  sx={{ minWidth: 120 }}
                >
                  {catLabel}
                </Button>
              );
            })}
          </Box>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {isLoading && (<Typography variant="h6" sx={{ textAlign: 'center', color: '#fff', width: '100%' }}>Loading products...</Typography>)}
            {error && (<Typography variant="h6" sx={{ textAlign: 'center', color: '#e94560', width: '100%' }}>Error loading products. Please try again later.</Typography>)}
            {!isLoading && !error && getFilteredProducts().length === 0 && (<Typography variant="h6" sx={{ textAlign: 'center', color: '#fff', width: '100%' }}>Aucun produit trouvé.</Typography>)}
            {!isLoading && !error && getFilteredProducts().map(product => {
              const imgObj = product.Product_img?.[0];
              const url = imgObj?.formats?.medium?.url || imgObj?.url;
              let imageUrl = buildImgUrl(url);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.07)', color: '#fff', borderRadius: { xs: 2, md: 3 }, boxShadow: '0 4px 24px 0 rgba(16,185,129,0.10)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.04)', boxShadow: '0 8px 32px 0 #10b981' }, cursor: 'pointer' }}>
                    <CardMedia component="img" image={imageUrl} alt={product.Product_name || 'Product'} sx={{ objectFit: 'cover', borderRadius: { xs: '16px 16px 0 0', md: '18px 18px 0 0' }, background: '#222', height: { xs: 140, sm: 160, md: 180 } }} />
                    <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' } }}>{currentLanguage === 'ar' && product.Product_name_ar ? product.Product_name_ar : product.Product_name || (currentLanguage === 'ar' ? 'اسم المنتج' : 'Product Name')}</Typography>
                      <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 800, fontSize: { xs: '1rem', md: '1.1rem' } }}>{product.Product_price || 0} DA</Typography>
                      <Typography variant="body2" sx={{ color: '#b8b8b8', mb: 1, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>{currentLanguage === 'ar' && product.Product_category_ar ? product.Product_category_ar : product.Product_category || (currentLanguage === 'ar' ? 'الفئة' : 'Category')}</Typography>
                      {product.Product_size && (<Typography variant="body2" sx={{ color: '#b8b8b8', mb: 1, fontSize: { xs: '0.8rem', md: '0.9rem' } }}>{currentLanguage === 'ar' ? `المقاس: ${product.Product_size}` : `Taille: ${product.Product_size}`}</Typography>)}
                      <Button variant="outlined" size="small" sx={{ borderColor: '#2196f3', color: '#2196f3', fontWeight: 700, mt: 1, fontSize: { xs: '0.8rem', md: '0.9rem' }, '&:hover': { background: '#2196f3', color: '#181818' } }} onClick={() => handleDetailsClick(product)}>{t('details')}</Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          {/* Debug Info - Remove this after testing */}
          <Box sx={{ textAlign: 'center', mt: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#fff', mb: 1 }}>
              Debug: Products loaded: {allProducts.length} | Has more: {hasMore ? 'Yes' : 'No'} | Current page: {currentPage}
            </Typography>
            {productsData?.meta?.pagination && (
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                Total: {productsData.meta.pagination.total} | Page size: {productsData.meta.pagination.pageSize}
              </Typography>
            )}
          </Box>
          {hasMore && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: '#2196f3', 
                  color: '#2196f3', 
                  fontWeight: 700, 
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  '&:hover': { background: '#2196f3', color: '#181818' } 
                }}
                onClick={loadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Customer Reviews Preview */}
      <Container maxWidth="xl">
        <Box sx={{ mt: { xs: 4, md: 8 }, px: { xs: 1, md: 2 }, mb: { xs: 4, md: 8 } }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: { xs: 2, md: 3 }, 
            color: '#10b981',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {t('clientReviews')}
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {reviews.map((review, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.07)', 
                  color: '#fff', 
                  borderRadius: { xs: 2, md: 3 }, 
                  p: { xs: 1.5, md: 2 },
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ 
                      bgcolor: '#1976d2', 
                      mr: 2,
                      width: { xs: 32, md: 40 },
                      height: { xs: 32, md: 40 }
                    }}>
                      {review.name[0]}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}>
                      {review.name}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly precision={0.5} sx={{ 
                    color: '#2196f3', 
                    mb: 1,
                    '& .MuiRating-iconFilled': {
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    },
                    '& .MuiRating-iconEmpty': {
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }
                  }} icon={<StarIcon fontSize="inherit" />} emptyIcon={<StarIcon fontSize="inherit" />} />
                  <Typography variant="body2" sx={{ 
                    color: '#b8b8b8',
                    fontSize: { xs: '0.8rem', md: '0.9rem' }
                  }}>
                    {review.comment}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: { xs: 2, md: 4 } }}>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: '#2196f3', 
                color: '#2196f3', 
                fontWeight: 700, 
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': { background: '#2196f3', color: '#181818' } 
              }}
              onClick={() => navigate('/avis-client')}
            >
              {t('viewAllReviews')}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 