import { useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./slider.css";
import IconSection from "./IconSection";

export default function Hero() {
  const textRefs = useRef([]);

  const handleSlideChange = (swiper) => {
    textRefs.current.forEach((ref) => ref?.classList.remove("animate"));
    const current = textRefs.current[swiper.realIndex];
    if (current) {
      void current.offsetWidth;
      current.classList.add("animate");
    }
  };

  const slides = [
    {
      image: "src/images/cardiopic.jpg",
      text: "Équipements de cardio",
      top: "15%",
      left: "30%",
      color: "white",
    },
    {
      image: "src/images/gym.jpg",
      text: "Tout matériel de musclulations",
      top: "10%",
      left: "40%",
      color: "rgba(227, 228, 231, 0.91)",
    },
    {
      image: "src/images/crossfit.jpg",
      text: "Équipements Crossfit ,     Street workout",
      top: "70%",
      left: "40%",
      color: "rgb(202, 186, 186)",
    },
    {
      image: "src/images/judo.jpg",
      text: "Équipements de Judo, Aïkido, Karaté, Taekwondo",
      top: "40%",
      left: "70%",
      color: "white",
    },
    {
      image: "src/images/kickbox.jpg",
      text: "Kick-Boxing et Boxe Thaï !",
      top: "62%",
      left: "60%",
      color: "theme.palette.text.secondary",
    },
  ];

  return (
    <Container>
      <Box
        sx={{
          mt: { xs: 1, sm: 2.5 },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 0 }
        }}
      >
        <Box 
          flexGrow={1} 
          width={{ xs: '100%', md: '65%' }}
        >
          <Swiper
            loop={true}
            pagination={{ type: "fraction" }}
            navigation={true}
            modules={[Pagination, Navigation, Autoplay]}
            className="mySwiper"
            onSlideChange={handleSlideChange}
            onSwiper={handleSlideChange}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="slide-container">
                  <img src={slide.image} alt="Slide" />
                  <Typography
                    component="div"
                    ref={(el) => {
                      if (el) textRefs.current[index] = el;
                    }}
                    className="slide-text"
                    sx={{
                      top: { xs: '50%', sm: slide.top },
                      left: { xs: '50%', sm: slide.left },
                      color: slide.color,
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' },
                      fontWeight: "bold",
                      position: "absolute",
                      transform: { xs: 'translate(-50%, -50%)', sm: 'translate(-50%, 0)' },
                      textAlign: 'center',
                      width: { xs: '90%', sm: 'auto' }
                    }}
                  >
                    {slide.text}
                  </Typography>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
        <Box
          width={{ xs: '100%', md: '35%' }}
          sx={{ 
            display: { xs: "none", md: "block" }, 
            ml: { md: 2 },
            height: { md: '500px' }
          }}
        >
          <Box sx={{ position: "relative" }}>
            <img 
              src="src/images/stade.jpg" 
              alt="stadium play" 
              style={{ width: '100%', height: 'auto' }}
            />
            <Stack 
              sx={{ 
                position: "absolute", 
                top: "57%", 
                left: "15px",
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Typography
                variant="caption"
                sx={{ 
                  color: "#211951", 
                  fontSize: { md: "22px" }, 
                  fontWeight: "bold" 
                }}
              >
                "L'excellence à chaque <br /> touche de balle"
              </Typography>
              <Link
                href="#"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#2B3445",
                  gap: "5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  "&:hover": {
                    color: "#black",
                  },
                }}
              >
                Voir plus
                <ArrowForwardIcon sx={{ fontSize: "20px", ml: 0.5 }} />
              </Link>
            </Stack>

            <img
              src="src/images/BoxeFight.jpg"
              alt="fightDZ"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                position: "absolute",
                top: "97.5%",
                left: "0",
                marginTop: "10px"
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(0, 0, 0, 0.8)",
                position: "absolute",
                top: "100%",
                left: "15px",
                fontSize: { md: "30px" },
                fontWeight: "bold",
                display: { xs: 'none', md: 'block' }
              }}
            >
              "Équipez-vous <br /> comme un pro!"
            </Typography>
            <Link
              href="#"
              sx={{
                position: "absolute",
                top: "140%",
                left: "15px",
                color: "black",
                fontSize: { md: "25px" },
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": {
                  color: "rgb(27, 85, 59)",
                },
                display: { xs: 'none', md: 'block' }
              }}
            >
              plus de détails
              <ArrowForwardIcon sx={{ fontSize: "20px", ml: 0.5 }} />
            </Link>
          </Box>
        </Box>
      </Box>
      <IconSection />
    </Container>
  );
}
