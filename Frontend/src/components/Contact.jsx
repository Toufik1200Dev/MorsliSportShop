import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Instagram,
  Phone,
  LocationOn,
  Email,
} from "@mui/icons-material";

export default function Contact() {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)', 
      minHeight: '100vh', 
      color: '#fff',
      pt: { xs: 10, sm: 12 },
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 2,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Contactez-nous
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#94a3b8',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Nous sommes là pour répondre à toutes vos questions
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Cards */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'rgba(17, 17, 17, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              height: '100%',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 4,
                    color: '#00d4ff',
                    textAlign: 'center'
                  }}
                >
                  Informations de Contact
                </Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                    }}>
                      <Phone sx={{ color: '#00d4ff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Téléphone
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        +213 672 108 091
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                    }}>
                      <Phone sx={{ color: '#00d4ff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Téléphone
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        +213 792 390 974
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                    }}>
                      <Phone sx={{ color: '#00d4ff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Téléphone
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        +213 557 862 386
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                    }}>
                      <Email sx={{ color: '#00d4ff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        contact@morslisport.com
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(0, 212, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.1)',
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                    }}>
                      <LocationOn sx={{ color: '#00d4ff', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                        Localisation
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Algérie
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Social Media & Hours */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              {/* Social Media */}
              <Card sx={{ 
                background: 'rgba(17, 17, 17, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 3,
                      color: '#00d4ff',
                      textAlign: 'center'
                    }}
                  >
                    Suivez-nous
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <IconButton
                      component="a"
                      href="https://www.instagram.com/morsli_sport.shop?igsh=MXg5bzIxMjFvOGluMA=="
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                        color: "white",
                        width: 60,
                        height: 60,
                        boxShadow: '0 4px 20px rgba(220, 38, 67, 0.4)',
                        "&:hover": {
                          transform: 'scale(1.1)',
                          boxShadow: '0 6px 30px rgba(220, 38, 67, 0.6)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Instagram sx={{ fontSize: 32 }} />
                    </IconButton>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textAlign: 'center', 
                      color: '#94a3b8',
                      fontWeight: 600
                    }}
                  >
                    @morsli_sport.shop
                  </Typography>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card sx={{ 
                background: 'rgba(17, 17, 17, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 3,
                      color: '#00d4ff',
                      textAlign: 'center'
                    }}
                  >
                    Heures d'ouverture
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Lundi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        8:00 - 18:00
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Mardi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        8:00 - 18:00
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Mercredi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        8:00 - 18:00
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Jeudi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        8:00 - 18:00
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(212, 255, 0, 0.05)',
                      border: '1px solid rgba(212, 255, 0, 0.2)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Vendredi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Fermé
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Samedi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        8:00 - 18:00
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid rgba(0, 212, 255, 0.1)',
                    }}>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        Dimanche
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        8:00 - 18:00
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
