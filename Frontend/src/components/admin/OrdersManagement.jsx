import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  Check as CheckIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  deleteOldOrders,
} from '../../api/orders';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [confirmingOrder, setConfirmingOrder] = useState(null);

  const tabs = [
    { label: 'Orders', status: null },
    { label: 'Confirmed', status: 'confirmed' },
    { label: 'Deleted', status: 'deleted' },
  ];

  useEffect(() => {
    loadOrders();
    
    // Auto-delete old orders in background (non-blocking)
    // Delay cleanup to not block initial load
    const cleanupTimeout = setTimeout(() => {
      cleanupOldOrders();
    }, 2000); // Run after 2 seconds
    
    // Set up interval to cleanup old orders every hour
    const cleanupInterval = setInterval(() => {
      cleanupOldOrders();
    }, 60 * 60 * 1000); // 1 hour

    return () => {
      clearTimeout(cleanupTimeout);
      clearInterval(cleanupInterval);
    };
  }, []);

  useEffect(() => {
    filterOrdersByTab();
  }, [currentTab, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      // Get all orders (no status filter)
      const data = await getOrders();
      
      // Normalize orders to ensure they have id fields and handle MongoDB _id
      const normalizedOrders = (Array.isArray(data) ? data : []).map(order => ({
        ...order,
        id: String(order.id || order._id || ''),
      }));
      
      setOrders(normalizedOrders);
    } catch (err) {
      setError('Échec du chargement des commandes: ' + (err.message || 'Erreur inconnue'));
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTab = () => {
    const status = tabs[currentTab].status;
    if (status === null) {
      setFilteredOrders(orders.filter(order => order.status === 'pending'));
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const cleanupOldOrders = async () => {
    try {
      await deleteOldOrders();
      // Only reload if we're on the page (not blocking initial load)
      if (!loading) {
        loadOrders();
      }
    } catch (err) {
      // Silent fail for cleanup
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'confirmed');
      setSuccess('Order confirmed successfully!');
      setConfirmingOrder(null);
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to confirm order: ' + err.message);
      setConfirmingOrder(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'deleted');
      setSuccess('Order deleted successfully!');
      setDeletingOrder(null);
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete order: ' + err.message);
      setDeletingOrder(null);
    }
  };

  const handlePermanentDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setSuccess('Order permanently deleted!');
      setDeletingOrder(null);
      loadOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete order: ' + err.message);
      setDeletingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'deleted':
        return 'error';
      default:
        return 'warning';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      // Handle MongoDB date format or standard Date
      const dateObj = date?.toDate ? date.toDate() : (date instanceof Date ? date : new Date(date));
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return 'N/A';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 900,
              color: '#ffffff',
              mb: 0.5,
              textShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
            }}
          >
            Commandes
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', letterSpacing: 0.5 }}>
            Gérez les commandes de vos clients
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(0, 212, 255, 0.2)',
            overflow: 'hidden',
            background: 'rgba(17, 17, 17, 0.8)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                color: '#94a3b8',
                '&.Mui-selected': {
                  color: '#00d4ff',
                  fontWeight: 700,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00d4ff',
                height: 3,
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
              },
            }}
          >
            {tabs.map((tab, index) => {
              const count = Array.isArray(orders) ? orders.filter(o => {
                if (tab.status === null) {
                  return o.status === 'pending';
                }
                return o.status === tab.status;
              }).length : 0;
              return (
                <Tab
                  key={index}
                  label={`${String(tab.label || '')} (${count})`}
                />
              );
            })}
          </Tabs>
        </Paper>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            '& .MuiAlert-icon': {
              color: '#ef4444',
            },
          }} 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            '& .MuiAlert-icon': {
              color: '#10b981',
            },
          }} 
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

        <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '100%',
          borderRadius: 3,
          border: '1px solid rgba(0, 212, 255, 0.2)',
          overflowX: 'auto',
          overflowY: 'hidden',
          background: 'rgba(17, 17, 17, 0.8)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(17, 17, 17, 0.5)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 212, 255, 0.3)',
            borderRadius: 4,
            '&:hover': {
              background: 'rgba(0, 212, 255, 0.5)',
            },
          },
        }}
      >
        <Table sx={{ minWidth: { xs: 800, sm: 1000 } }}>
          <TableHead>
            <TableRow sx={{ 
              background: '#0a0a0a',
              borderBottom: '2px solid rgba(0, 212, 255, 0.2)',
            }}>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                py: 2.5,
                minWidth: { xs: 100, sm: 120 },
              }}>Date</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 120, sm: 150 },
              }}>Client</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 110, sm: 130 },
              }}>Téléphone</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                display: { xs: 'none', lg: 'table-cell' },
                minWidth: 200,
              }}>Adresse</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                display: { xs: 'none', sm: 'table-cell' },
                minWidth: 100,
              }}>Produits</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 100, sm: 120 },
              }}>Total</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 90, sm: 100 },
              }}>Statut</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 100, sm: 120 },
              }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                    Aucune commande trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <TableRow 
                  key={String(order.id || order._id || `order-${index}`)} 
                  hover
                  sx={{
                    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                    backgroundColor: 'rgba(17, 17, 17, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TableCell sx={{ 
                    color: '#ffffff', 
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#ffffff',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  }}>
                    {order.clientName || order.name || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#94a3b8', 
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}>
                    {order.phone || order.telephone || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#94a3b8', 
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    display: { xs: 'none', lg: 'table-cell' },
                    maxWidth: 200,
                  }}>
                    {order.address || order.adresse || 'N/A'}
                    {order.city && `, ${order.city}`}
                    {order.wilaya && `, ${order.wilaya}`}
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#94a3b8', 
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    display: { xs: 'none', sm: 'table-cell' },
                  }}>
                    {order.items?.length || order.products?.length || 0} article(s)
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: '#00d4ff',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  }}>
                    {order.total?.toLocaleString() || order.price?.toLocaleString() || '0'} DZD
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status || 'pending'}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        ...(order.status === 'confirmed' && {
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.15) 100%)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
                        }),
                        ...(order.status === 'deleted' && {
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
                        }),
                        ...(order.status === 'pending' && {
                          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(202, 138, 4, 0.15) 100%)',
                          color: '#eab308',
                          border: '1px solid rgba(234, 179, 8, 0.4)',
                          boxShadow: '0 0 15px rgba(234, 179, 8, 0.3)',
                        }),
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => setViewingOrder(order)}
                      size="small"
                      title="Voir les détails"
                      sx={{
                        color: '#3b82f6',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 212, 255, 0.15)',
                          transform: 'scale(1.15)',
                          boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                        },
                        transition: 'all 0.3s ease',
                        mr: 0.5,
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                    {order.status === 'pending' && (
                      <>
                        <IconButton
                          onClick={() => setConfirmingOrder(order)}
                          size="small"
                          title="Confirmer"
                          sx={{
                            color: '#10b981',
                            '&:hover': {
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              transform: 'scale(1.15)',
                              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                            },
                            transition: 'all 0.3s ease',
                            mr: 0.5,
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeletingOrder(order)}
                          size="small"
                          title="Supprimer"
                          sx={{
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              transform: 'scale(1.15)',
                              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                    {order.status === 'deleted' && (
                      <IconButton
                        onClick={() => {
                          if (window.confirm('Permanent delete?')) {
                            handlePermanentDelete(order.id);
                          }
                        }}
                        size="small"
                        title="Supprimer définitivement"
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            transform: 'scale(1.15)',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Order Details Dialog */}
      <Dialog
        open={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)',
            color: '#fff',
            fontWeight: 800,
            py: 2.5,
            px: 3,
            borderBottom: '2px solid rgba(0, 212, 255, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.2), inset 0 0 30px rgba(0, 212, 255, 0.05)',
          }}
        >
          <Typography sx={{ 
            background: 'linear-gradient(135deg, #00d4ff 0%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
          }}>
            Détails de la Commande
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#0a0a0a', borderColor: 'rgba(0, 212, 255, 0.1)' }}>
          {viewingOrder && (
            <Box>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  color: '#3b82f6',
                  fontSize: '1.1rem',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid rgba(0, 212, 255, 0.3)',
                  textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                }}
              >
                Informations Client
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1, color: '#94a3b8' }}>
                  <strong style={{ color: '#00d4ff' }}>Nom:</strong> {viewingOrder.clientName || viewingOrder.name}
                </Typography>
                <Typography sx={{ mb: 1, color: '#94a3b8' }}>
                  <strong style={{ color: '#00d4ff' }}>Email:</strong> {viewingOrder.email}
                </Typography>
                <Typography sx={{ mb: 1, color: '#94a3b8' }}>
                  <strong style={{ color: '#00d4ff' }}>Téléphone:</strong> {viewingOrder.phone || viewingOrder.telephone}
                </Typography>
                <Typography sx={{ mb: 1, color: '#94a3b8' }}>
                  <strong style={{ color: '#00d4ff' }}>Adresse:</strong> {viewingOrder.address || viewingOrder.adresse}
                </Typography>
                {viewingOrder.city && (
                  <Typography sx={{ mb: 1, color: '#94a3b8' }}>
                    <strong style={{ color: '#00d4ff' }}>Ville:</strong> {viewingOrder.city}
                  </Typography>
                )}
                {viewingOrder.wilaya && (
                  <Typography sx={{ mb: 1, color: '#94a3b8' }}>
                    <strong style={{ color: '#00d4ff' }}>Wilaya:</strong> {viewingOrder.wilaya}
                  </Typography>
                )}
              </Box>
              
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  mt: 3, 
                  fontWeight: 800,
                  color: '#3b82f6',
                  fontSize: '1.1rem',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid rgba(0, 212, 255, 0.3)',
                  textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                }}
              >
                Produits
              </Typography>
              <Box sx={{ mb: 3 }}>
                {(viewingOrder.items || viewingOrder.products || []).map((item, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      mb: 2, 
                      p: 2.5, 
                      border: '2px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: 2,
                      backgroundColor: 'rgba(17, 17, 17, 0.5)',
                      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.1)',
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: '#e2e8f0', mb: 1, fontSize: '1.05rem' }}>
                      {item.name || item.Product_name}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', mb: 0.5 }}>
                      Quantité: <strong style={{ color: '#00d4ff' }}>{item.quantity || 1}</strong>
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', mb: 0.5 }}>
                      Prix: <strong style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>{item.price?.toLocaleString() || item.Product_price?.toLocaleString() || '0'} DZD</strong>
                    </Typography>
                    {item.size && (
                      <Typography sx={{ color: '#94a3b8' }}>
                        Taille: <strong style={{ color: '#00d4ff' }}>{item.size}</strong>
                      </Typography>
                    )}
                    {item.color && (
                      <Typography sx={{ color: '#94a3b8' }}>
                        Couleur: <strong style={{ color: '#00d4ff' }}>{item.color}</strong>
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ 
                mt: 3, 
                p: 2.5,
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 184, 212, 0.15) 100%)',
                borderRadius: 2,
                border: '2px solid rgba(0, 212, 255, 0.4)',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 900,
                    color: '#3b82f6',
                    textAlign: 'center',
                    textShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
                  }}
                >
                  Total: {viewingOrder.total?.toLocaleString() || viewingOrder.price?.toLocaleString() || '0'} DZD
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0, 212, 255, 0.1)', backgroundColor: '#0a0a0a' }}>
          <Button 
            onClick={() => setViewingOrder(null)}
            sx={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
              color: '#000',
              fontWeight: 800,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 212, 255, 0.5), 0 0 30px rgba(0, 212, 255, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00b8d4 0%, #00a8cc 100%)',
                boxShadow: '0 6px 30px rgba(0, 212, 255, 0.7), 0 0 40px rgba(0, 212, 255, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Order Dialog */}
      <Dialog 
        open={Boolean(confirmingOrder)} 
        onClose={() => setConfirmingOrder(null)}
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)',
            color: '#fff',
            fontWeight: 800,
            py: 2.5,
            px: 3,
            borderBottom: '2px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2), inset 0 0 30px rgba(16, 185, 129, 0.05)',
          }}
        >
          <Typography sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
          }}>
            Confirmer la Commande
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#0a0a0a', borderColor: 'rgba(16, 185, 129, 0.1)' }}>
          <Typography sx={{ color: '#e2e8f0', fontSize: '1rem', mb: 2 }}>
            Êtes-vous sûr de vouloir confirmer cette commande?
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Note: Cette commande sera automatiquement supprimée après 3 jours.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(16, 185, 129, 0.1)', backgroundColor: '#0a0a0a' }}>
          <Button 
            onClick={() => setConfirmingOrder(null)}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(100, 116, 139, 0.15)',
                color: '#e2e8f0',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleConfirmOrder(confirmingOrder.id)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 800,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 6px 30px rgba(16, 185, 129, 0.7), 0 0 40px rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Order Dialog */}
      <Dialog 
        open={Boolean(deletingOrder)} 
        onClose={() => setDeletingOrder(null)}
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)',
            color: '#fff',
            fontWeight: 800,
            py: 2.5,
            px: 3,
            borderBottom: '2px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.2), inset 0 0 30px rgba(239, 68, 68, 0.05)',
          }}
        >
          <Typography sx={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
          }}>
            Supprimer la Commande
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#0a0a0a', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
          <Typography sx={{ color: '#e2e8f0', fontSize: '1rem', mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer cette commande?
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Note: Cette commande sera automatiquement supprimée après 1 jour.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(239, 68, 68, 0.1)', backgroundColor: '#0a0a0a' }}>
          <Button 
            onClick={() => setDeletingOrder(null)}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(100, 116, 139, 0.15)',
                color: '#e2e8f0',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleDeleteOrder(deletingOrder.id)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              fontWeight: 800,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 6px 30px rgba(239, 68, 68, 0.7), 0 0 40px rgba(239, 68, 68, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersManagement;

