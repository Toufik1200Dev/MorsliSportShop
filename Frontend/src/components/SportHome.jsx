import React from 'react';
import { Box, Typography, Button, Stack, Grid, Card, CardContent, CardMedia, Avatar, Rating, Container, Dialog, IconButton } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StarIcon from '@mui/icons-material/Star';
import { Close } from '@mui/icons-material';
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
import ProductDetails from './main/ProductDetails';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

const API_URL = "http://localhost:1337";

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
  { icon: <DirectionsRunIcon fontSize="large" sx={{ color: '#1976d2' }} />, label: 'Livraison Express' },
  { icon: <FitnessCenterIcon fontSize="large" sx={{ color: '#1976d2' }} />, label: 'Matériel Pro' },
  { icon: <SportsMmaIcon fontSize="large" sx={{ color: '#1976d2' }} />, label: 'Paiement Sécurisé' },
  { icon: <SportsSoccerIcon fontSize="large" sx={{ color: '#1976d2' }} />, label: 'Conseils Experts' },
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

export default function SportHome() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { data: productsData, error, isLoading } = useGetProductsQuery();
  
  // Dialog state
  const [open, setOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  
  // Category filter state
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  
  // Debug: Log the actual data structure
  console.log('Products Data:', productsData);
  console.log('Products Data.data:', productsData?.data);
  
  // Get real products from API, limit to 8 for featured section
  const allProducts = productsData?.data || [];
  
  // Filter products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return allProducts.slice(0, 8);
    }
    return allProducts
      .filter(product => 
        product.Product_category?.toLowerCase() === selectedCategory.toLowerCase()
      )
      .slice(0, 8);
  };
  
  const featuredProducts = getFilteredProducts();
  
  // Debug: Log the featured products
  console.log('Featured Products:', featuredProducts);

  const handleClickOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
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
              background: '#1976d2',
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.2rem' },
              px: { xs: 3, md: 5 },
              py: { xs: 1, md: 1.5 },
              borderRadius: 3,
              boxShadow: '0 4px 24px 0 rgba(25,118,210,0.2)',
              '&:hover': { background: '#2196f3', color: '#181818' },
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
      <Container maxWidth="xl">
        <Box sx={{ 
          py: { xs: 3, md: 6 }, 
          px: { xs: 1, md: 0 },
          background: 'linear-gradient(135deg, #181818 0%, #111 100%)',
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
              maxWidth: { lg: '60%' }
            }}>
              <Swiper
                loop={true}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation, Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                style={{ borderRadius: '16px', overflow: 'hidden' }}
              >
                {heroSlides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <Box sx={{ position: 'relative', height: { xs: '250px', sm: '300px', md: '400px' } }}>
                      <img 
                        src={slide.image} 
                        alt="Sport Equipment" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
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
        </Box>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="xl">
        <Box id="products" sx={{ mt: { xs: 3, md: 6 }, px: { xs: 1, md: 2 } }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: { xs: 2, md: 3 }, 
            color: '#2196f3',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {selectedCategory === 'all' 
              ? getTranslation('selectedProducts', currentLanguage)
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
            }
          </Typography>
          
          {isLoading && (
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#fff' }}>
              Loading products...
            </Typography>
          )}
          
          {error && (
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#e94560' }}>
              Error loading products. Please try again later.
            </Typography>
          )}
          
          {!isLoading && !error && featuredProducts.length === 0 && (
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#fff' }}>
              No products available at the moment.
            </Typography>
          )}
          
          {!isLoading && !error && featuredProducts.length > 0 && (
            <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
              {featuredProducts.map((product) => {
                // Debug: Log each product
                console.log('Product:', product);
                
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card sx={{
                      background: '#181818',
                      color: '#fff',
                      borderRadius: { xs: 2, md: 3 },
                      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.04)',
                        boxShadow: '0 8px 32px 0 #1976d2',
                      },
                      cursor: 'pointer',
                    }}>
                      <CardMedia
                        component="img"
                        image={
                          product.Product_img?.[0]?.url 
                            ? `${API_URL}${product.Product_img[0].url}`
                            : product.Product_img?.[0]?.formats?.medium?.url
                            ? `${API_URL}${product.Product_img[0].formats.medium.url}`
                            : '/default-image.png'
                        }
                        alt={product.Product_name || 'Product'}
                        sx={{ 
                          objectFit: 'cover', 
                          borderRadius: { xs: '16px 16px 0 0', md: '18px 18px 0 0' }, 
                          background: '#222',
                          height: { xs: 140, sm: 160, md: 180 }
                        }}
                      />
                      <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '1rem', md: '1.1rem' }
                        }}>
                          {product.Product_name || 'Product Name'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#2196f3', 
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }}>
                          {product.Product_price || 0} DA
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#b8b8b8', 
                          mb: 1,
                          fontSize: { xs: '0.8rem', md: '0.9rem' }
                        }}>
                          {product.Product_category || 'Category'}
                        </Typography>
                        {product.Product_size && (
                          <Typography variant="body2" sx={{ 
                            color: '#b8b8b8', 
                            mb: 1,
                            fontSize: { xs: '0.8rem', md: '0.9rem' }
                          }}>
                            Size: {product.Product_size}
                          </Typography>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ 
                            borderColor: '#2196f3', 
                            color: '#2196f3', 
                            fontWeight: 700, 
                            mt: 1, 
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            '&:hover': { background: '#2196f3', color: '#181818' } 
                          }}
                          onClick={() => handleClickOpen(product)}
                        >
                          {getTranslation('details', currentLanguage)}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>

      {/* Why Choose Us */}
      <Container maxWidth="xl">
        <Box sx={{ mt: { xs: 4, md: 8 }, px: { xs: 1, md: 2 } }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: { xs: 2, md: 3 }, 
            color: '#2196f3',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            Pourquoi nous choisir ?
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {whyChoose.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{
                  background: '#111',
                  borderRadius: { xs: 2, md: 3 },
                  p: { xs: 2, md: 3 },
                  textAlign: 'center',
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.12)',
                  color: '#fff',
                  minHeight: { xs: 120, md: 140 },
                }}>
                  {React.cloneElement(item.icon, { 
                    sx: { 
                      fontSize: { xs: '2rem', md: 'large' }, 
                      color: '#1976d2' 
                    } 
                  })}
                  <Typography variant="h6" sx={{ 
                    mt: { xs: 1, md: 2 }, 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.1rem' }
                  }}>
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Customer Reviews Preview */}
      <Container maxWidth="xl">
        <Box sx={{ mt: { xs: 4, md: 8 }, px: { xs: 1, md: 2 }, mb: { xs: 4, md: 8 } }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: { xs: 2, md: 3 }, 
            color: '#2196f3',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {getTranslation('clientReviews', currentLanguage)}
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {reviews.map((review, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ 
                  background: '#181818', 
                  color: '#fff', 
                  borderRadius: { xs: 2, md: 3 }, 
                  p: { xs: 1.5, md: 2 } 
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
              {getTranslation('viewAllReviews', currentLanguage)}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Product Details Dialog */}
      <Dialog
        sx={{
          ".MuiPaper-root": {
            minWidth: { xs: "95%", md: 800 },
            background: '#f8fafc',
            borderRadius: { xs: 2, md: 4 },
            p: { xs: 1, md: 2 },
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
            top: { xs: 5, md: 0 },
            right: { xs: 5, md: 10 },
            zIndex: 1,
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>

        <ProductDetails product={selectedProduct} onClose={handleClose} />
      </Dialog>
    </Box>
  );
} 