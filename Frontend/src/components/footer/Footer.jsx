import { Box, Typography, Stack, IconButton, Container } from "@mui/material";
import React from "react";
import { Instagram, Phone, Email, LocationOn } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#2B3445",
        py: 3,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        mt: 4
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* Contact Information */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2
          }}>
            <Box>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                Morsli Sport
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
                Your premier destination for high-quality sports equipment
              </Typography>
            </Box>

            <Stack spacing={1} sx={{ alignItems: { xs: 'center', md: 'flex-end' } }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#e94560', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  +213 672 108 091
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#e94560', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  +213 792 390 974
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#e94560', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  +213 557 862 386
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#e94560', fontSize: '1rem' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  Algeria
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={1} sx={{ alignItems: { xs: 'center', md: 'flex-end' } }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                Follow Us
              </Typography>
              <IconButton
                component="a"
                href="https://www.instagram.com/morsli_sport.shop?igsh=MXg5bzIxMjFvOGluMA=="
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                  color: "white",
                  "&:hover": {
                    opacity: 0.9,
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <Instagram />
              </IconButton>
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                @morsli_sport.shop
              </Typography>
            </Stack>
          </Box>

          {/* Copyright */}
          <Box sx={{ 
            borderTop: '1px solid #444', 
            pt: 2,
            textAlign: 'center'
          }}>
            <Typography
              variant="body2"
              sx={{ color: '#ccc' }}
            >
              © 2025 Morsli Sport. All rights reserved. Designed and developed by Toufik Rahmani
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
