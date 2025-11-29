import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Home as HomeIcon,
  SportsSoccer as SportsIcon,
} from '@mui/icons-material';
import { useAdminAuth } from '../../context/AdminAuthContext';

const drawerWidth = 280;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Mes Produits', icon: ProductsIcon, path: '/admin/products' },
    { text: 'Commandes', icon: OrdersIcon, path: '/admin/orders' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', background: '#000000', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          background: '#0a0a0a',
          color: '#fff',
          minHeight: '80px !important',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
            }}
          >
            <SportsIcon sx={{ fontSize: 24, color: '#000' }} />
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ 
            fontWeight: 700, 
            fontSize: '1.1rem',
            color: '#00d4ff',
          }}>
            Morsli Sport
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 2, pt: 3, flex: 1, background: '#000000' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#00b8d4',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#fff',
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#fff' : '#9ca3af',
                  minWidth: 40,
                  transition: 'all 0.2s ease',
                }}
              >
                {item.icon && <item.icon />}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.95rem',
                  color: location.pathname === item.path ? '#fff' : '#d1d5db',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 212, 255, 0.2)' }}>
        <ListItemButton
          onClick={() => navigate('/')}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            color: '#00d4ff',
            '&:hover': {
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#00d4ff', minWidth: 40 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Accueil"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.95rem',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
      }}>
        <CircularProgress sx={{ color: '#00d4ff', mb: 2 }} />
        <Typography sx={{ color: '#94a3b8', fontWeight: 500, letterSpacing: 1 }}>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: '#0a0a0a',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <Toolbar sx={{ minHeight: '75px !important', px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' }, 
              color: '#94a3b8',
              '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                color: '#00d4ff',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#00d4ff',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.3rem' },
              letterSpacing: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: { xs: '120px', sm: 'none' },
            }}
          >
            {menuItems.find(item => item.path === location.pathname)?.text || 'Admin'}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
          }}>
            {/* Logos - Hide on very small screens */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex' }, 
              alignItems: 'center', 
              gap: 1.5 
            }}>
              <Box
                component="img"
                src="/images/MorsliSportLogo.png"
                alt="Morsli Sport Logo"
                sx={{
                  height: { sm: 32, md: 36 },
                  width: 'auto',
                  maxWidth: { sm: 80, md: 100 },
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 212, 255, 0.3))',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Box
                component="img"
                src="/images/areasportLogo.png"
                alt="Area Sport Logo"
                sx={{
                  height: { sm: 32, md: 36 },
                  width: 'auto',
                  maxWidth: { sm: 80, md: 100 },
                  objectFit: 'contain',
                  borderRadius: '4px',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 212, 255, 0.3))',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
            
            {/* Home Button */}
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                color: '#00d4ff',
                padding: { xs: '8px', sm: '12px' },
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  color: '#00d4ff',
                },
                transition: 'all 0.2s ease',
              }}
              title="Accueil"
            >
              <HomeIcon sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%',
          overflowX: 'hidden',
          backgroundColor: '#000000',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #111111 100%)',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;

