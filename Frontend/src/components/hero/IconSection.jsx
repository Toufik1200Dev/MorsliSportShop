import { Box, Container, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";

export default function IconSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(min-width:600px)");

  return (
    <Container 
      sx={{
        bgcolor: theme.palette.mode === "dark" ? "#000" : "#fff",
        mt: 3,
        py: { xs: 2, sm: 3 }
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={isMobile ? "center" : "left"}
        flexWrap={"wrap"}
        gap={2}
        divider={isMobile ? <Divider orientation="vertical" flexItem /> : null}
      >
        <MyBox
          icon={<ElectricBoltIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
          title={"fast delivery"}
          subTitle={"start from 400da"}
        />
        <MyBox
          icon={<CreditScoreOutlinedIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
          title={"Money back guarantee"}
          subTitle={"7 days return"}
        />
        <MyBox
          icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
          title={"365 days support"}
          subTitle={"for all products"}
        />
        <MyBox
          icon={<AccessAlarmOutlinedIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />}
          title={"Payment on delivery"}
          subTitle={"secure service"}
        />
      </Stack>
    </Container>
  );
}

function MyBox({ icon, title, subTitle }) {
  return (
    <Box 
      sx={{
        width: { xs: '100%', sm: '250px' },
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        gap: { xs: 2, sm: 3 },
        justifyContent: "center",
        py: { xs: 1, sm: 1.6 }
      }}
    >
      {icon}
      <Box>
        <Typography 
          variant="body1"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            fontWeight: 'medium'
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ 
            fontWeight: 300, 
            color: "text.secondary",
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
          variant="body1"
        >
          {subTitle}
        </Typography>
      </Box>
    </Box>
  );
}
