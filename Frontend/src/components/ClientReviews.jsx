import { Box, Typography, Grid, Card, CardContent, Avatar, Rating, Stack, Container } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const reviews = [
  { name: 'Yacine B.', rating: 5, comment: 'Super produits, livraison rapide et service client au top!' },
  { name: 'Sarah L.', rating: 4, comment: "J'ai trouvé tout ce qu'il me fallait pour la salle de sport." },
  { name: 'Mehdi K.', rating: 5, comment: 'Qualité excellente, je recommande vivement.' },
  { name: 'Nadia T.', rating: 5, comment: 'Livraison à temps et produits bien emballés.' },
  { name: 'Karim D.', rating: 4, comment: 'Bon rapport qualité/prix, je recommande.' },
  { name: 'Sofiane M.', rating: 5, comment: 'Le service client est très réactif.' },
  { name: 'Melissa D.', rating: 5, comment: 'Great work 😍😍,Good luck😍' },
  { name: 'Rachid F.', rating: 4, comment: 'Site facile à utiliser, commande rapide.' },
  { name: 'Lina S.', rating: 5, comment: 'Très satisfaite de ma commande, merci !' },
  { name: 'Omar B.', rating: 5, comment: 'Produits de qualité, je reviendrai.' },
];

const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

export default function ClientReviews() {
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
            Avis Clients
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            alignItems="center" 
            sx={{ mb: 2 }}
          >
            <Rating 
              value={parseFloat(averageRating)} 
              precision={0.1} 
              readOnly 
              sx={{ 
                color: '#00d4ff',
                '& .MuiRating-iconFilled': {
                  filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))',
                }
              }} 
              icon={<StarIcon fontSize="inherit" />} 
              emptyIcon={<StarIcon fontSize="inherit" />} 
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
              }}
            >
              {averageRating}/5
            </Typography>
          </Stack>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#94a3b8',
              fontSize: { xs: '0.95rem', sm: '1.1rem' }
            }}
          >
            {reviews.length} avis vérifiés
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {reviews.map((review, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ 
                background: 'rgba(17, 17, 17, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3)',
                  borderColor: 'rgba(0, 212, 255, 0.4)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
                      background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
                      color: '#000',
                      fontWeight: 800,
                      mr: 2,
                      width: 45,
                      height: 45,
                      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                    }}>
                      {review.name[0]}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#ffffff',
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      {review.name}
                    </Typography>
                  </Box>
                  <Rating 
                    value={review.rating} 
                    readOnly 
                    precision={0.5} 
                    sx={{ 
                      color: '#00d4ff',
                      mb: 2,
                      '& .MuiRating-iconFilled': {
                        filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.4))',
                      }
                    }} 
                    icon={<StarIcon fontSize="inherit" />} 
                    emptyIcon={<StarIcon fontSize="inherit" />} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#94a3b8',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
