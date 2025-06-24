import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Rating, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const reviews = [
  { name: 'Yacine B.', rating: 5, comment: 'Super produits, livraison rapide et service client au top!' },
  { name: 'Sarah L.', rating: 4, comment: "J'ai trouvé tout ce qu'il me fallait pour la salle de sport." },
  { name: 'Mehdi K.', rating: 5, comment: 'Qualité excellente, je recommande vivement.' },
  { name: 'Nadia T.', rating: 5, comment: 'Livraison à temps et produits bien emballés.' },
  { name: 'Karim D.', rating: 4, comment: 'Bon rapport qualité/prix, je recommande.' },
  { name: 'Sofiane M.', rating: 5, comment: 'Le service client est très réactif.' },
  { name: 'Amina Z.', rating: 5, comment: 'J\'adore la selection de produits sportifs.' },
  { name: 'Rachid F.', rating: 4, comment: 'Site facile à utiliser, commande rapide.' },
  { name: 'Lina S.', rating: 5, comment: 'Très satisfaite de ma commande, merci !' },
  { name: 'Omar B.', rating: 5, comment: 'Produits de qualité, je reviendrai.' },
];

const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

export default function ClientReviews() {
  return (
    <Box sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', minHeight: '100vh', color: '#fff', py: 6 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: '#ffd700' }}>Avis Clients</Typography>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
          <Rating value={parseFloat(averageRating)} precision={0.1} readOnly sx={{ color: '#ffd700' }} icon={<StarIcon fontSize="inherit" />} emptyIcon={<StarIcon fontSize="inherit" />} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{averageRating}/5</Typography>
        </Stack>
        <Typography variant="body1" sx={{ color: '#b8b8b8' }}>{reviews.length} avis vérifiés</Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {reviews.map((review, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card sx={{ background: '#16213e', color: '#fff', borderRadius: 3, p: 2, minHeight: 180 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: '#e94560', mr: 2 }}>{review.name[0]}</Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{review.name}</Typography>
              </Box>
              <Rating value={review.rating} readOnly precision={0.5} sx={{ color: '#ffd700', mb: 1 }} icon={<StarIcon fontSize="inherit" />} emptyIcon={<StarIcon fontSize="inherit" />} />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="body2" sx={{ color: '#b8b8b8' }}>{review.comment}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 