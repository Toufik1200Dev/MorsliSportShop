import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";

export default function Contact() {
  const theme = useTheme();

  return (
    <Container sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
          minHeight: "60vh",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/images/MorsliSportLogo.png"
            alt="Morsli Sport Logo"
            style={{
              height: "200px",
              width: "auto",
              objectFit: "contain",
              marginBottom: "20px",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              textAlign: "center",
              mb: 2,
            }}
          >
            Morsli Sport
          </Typography>
        </Box>

        {/* Contact Information Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Contact Us
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: theme.palette.text.secondary,
              mb: 3,
            }}
          >
            Welcome to Morsli Sport, your premier destination for high-quality sports equipment 
            and fitness gear. We specialize in providing top-notch equipment for all your sporting 
            needs, from cardio machines to martial arts gear.
          </Typography>

          {/* Contact Details */}
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Phone sx={{ color: "#e94560", fontSize: "1.5rem" }} />
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                +213 672 108 091
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Phone sx={{ color: "#e94560", fontSize: "1.5rem" }} />
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                +213 792 390 974
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Phone sx={{ color: "#e94560", fontSize: "1.5rem" }} />
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                +213 557 862 386
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Email sx={{ color: "#e94560", fontSize: "1.5rem" }} />
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                contact@morslisport.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocationOn sx={{ color: "#e94560", fontSize: "1.5rem" }} />
              <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                Algeria
              </Typography>
            </Box>
          </Stack>

          {/* Social Media */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Follow Us
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  bgcolor: "#1877f2",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#166fe5",
                  },
                  width: 50,
                  height: 50,
                }}
              >
                <Facebook />
              </IconButton>
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
                  width: 50,
                  height: 50,
                }}
              >
                <Instagram />
              </IconButton>
            </Stack>
            <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
              @morsli_sport.shop
            </Typography>
          </Box>

          {/* Business Hours */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Business Hours
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
              Monday - Friday: 9:00 AM - 8:00 PM
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
              Saturday: 9:00 AM - 6:00 PM
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
              Sunday: 10:00 AM - 4:00 PM
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 