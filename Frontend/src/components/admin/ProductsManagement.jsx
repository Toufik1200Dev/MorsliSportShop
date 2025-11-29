import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Card,
  CardContent,
  InputAdornment,
  Checkbox,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  AddShoppingCart as NewProductsIcon,
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../../api/products';

const PRODUCT_CATEGORIES = ['all', 'Football', 'Sport de Combat', 'Gym'];
const PRODUCT_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL',
  '150cm', '155cm', '160cm', '165cm', '170cm', '175cm', '180cm', '185cm', '190cm'
];
const PRODUCT_COLORS = [
  'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet',
  'Black', 'White', 'Gray', 'Brown', 'Pink'
];

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    Product_name: '',
    Product_desctiption: '',
    Product_price: '',
    Product_category: 'all',
    Product_sizes: [],
    Product_color: [],
  });
  const [productImages, setProductImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const [customColor, setCustomColor] = useState('#ff0000');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const filterProducts = () => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.Product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.Product_category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filtering
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Increase timeout for slower connections
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La connexion au serveur a pris trop de temps. Vérifiez votre configuration API dans .env')), 30000)
      );
      
      const data = await Promise.race([
        getProducts(),
        timeoutPromise
      ]);
      
      // Ensure data is always an array and normalize IDs
      const productsArray = Array.isArray(data) 
        ? data.map(product => ({
            ...product,
            id: String(product.id || product._id || ''),
          }))
        : [];
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (err) {
      const errorMessage = err.message || 'Erreur inconnue';
      setError('Échec du chargement des produits: ' + errorMessage);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const currentPageProducts = getCurrentPageProducts();
      setSelectedProducts(currentPageProducts.map(p => String(p.id || p._id || '')));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCurrentPageProducts = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        Product_name: product.Product_name || '',
        Product_desctiption: product.Product_desctiption || '',
        Product_price: product.Product_price?.toString() || '',
        Product_category: product.Product_category || 'all',
        Product_sizes: product.Product_sizes || [],
        Product_color: product.Product_color || [],
      });
      // Ensure Product_img is an array and normalize URLs
      const normalizedImages = Array.isArray(product.Product_img) 
        ? product.Product_img.map(img => {
            // If it's already a string URL, use it
            if (typeof img === 'string') return img;
            // If it's an object, extract the URL
            return img?.url || img?.secure_url || img?.formats?.medium?.url || String(img || '');
          }).filter(img => img) // Filter out empty strings
        : [];
      setProductImages(normalizedImages);
      setNewImages([]);
    } else {
      setEditingProduct(null);
      setFormData({
        Product_name: '',
        Product_desctiption: '',
        Product_price: '',
        Product_category: 'all',
        Product_sizes: [],
        Product_color: [],
      });
      setProductImages([]);
      setNewImages([]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setProductImages([]);
    setNewImages([]);
    setColorPickerOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setProductImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      Product_sizes: prev.Product_sizes.includes(size)
        ? prev.Product_sizes.filter((s) => s !== size)
        : [...prev.Product_sizes, size],
    }));
  };

  const handleColorToggle = (color) => {
    setFormData((prev) => ({
      ...prev,
      Product_color: prev.Product_color.includes(color)
        ? prev.Product_color.filter((c) => c !== color)
        : [...prev.Product_color, color],
    }));
  };

  const handleAddCustomColor = () => {
    const rgbaColor = `rgba(${customColor.rgb.r}, ${customColor.rgb.g}, ${customColor.rgb.b}, ${customColor.rgb.a || 1})`;
    if (!formData.Product_color.includes(rgbaColor)) {
      setFormData((prev) => ({
        ...prev,
        Product_color: [...prev.Product_color, rgbaColor],
      }));
    }
    setColorPickerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');

      // Validate required fields
      if (!formData.Product_name || !formData.Product_price) {
        setError('Veuillez remplir tous les champs requis (Nom et Prix)');
        return;
      }

      if (productImages.length + newImages.length === 0) {
        setError('Veuillez ajouter au moins une image');
        return;
      }

      // Validate category
      if (!formData.Product_category || formData.Product_category === 'all') {
        setError('Veuillez sélectionner une catégorie valide');
        return;
      }

      setLoading(true);

      if (editingProduct) {
        // Update existing product - separate existing URLs and new File objects
        await updateProduct(editingProduct.id, {
          ...formData,
          existingImages: productImages.filter(img => typeof img === 'string'), // Only URLs
          newImages: newImages, // Only File objects
          removedImages: [], // Track removed images if needed
        });
        setSuccess('Produit mis à jour avec succès!');
      } else {
        // Create new product - only send File objects (newImages)
        await createProduct({
          ...formData,
          images: newImages, // Only File objects for new products
        });
        setSuccess('Produit créé avec succès!');
      }

      handleCloseDialog();
      await loadProducts(); // Reload products to show the new/updated product
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde: ' + (err.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(deletingProduct.id);
      setSuccess('Product deleted successfully!');
      setDeletingProduct(null);
      loadProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
      setDeletingProduct(null);
    }
  };

  if (loading && products.length === 0 && !error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
        <CircularProgress sx={{ color: '#00d4ff' }} />
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Chargement des produits...
        </Typography>
      </Box>
    );
  }

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.Product_category && p.Product_category !== 'all').length;
  const newProductsThisMonth = products.filter(p => {
    if (!p.createdAt) return false;
    try {
      const createdDate = p.createdAt?.toDate ? p.createdAt.toDate() : (p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt));
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  }).length;

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            width: '100%',
            borderRadius: 2, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            height: '100%',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 2, sm: 0 } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Total Produits
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {totalProducts}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    +{newProductsThisMonth} ce mois
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: { xs: 48, sm: 56 }, 
                  height: { xs: 48, sm: 56 }, 
                  borderRadius: 2, 
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <InventoryIcon sx={{ color: '#fff', fontSize: { xs: 24, sm: 28 } }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            width: '100%',
            borderRadius: 2, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            height: '100%',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 2, sm: 0 } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Produits Actifs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {activeProducts}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Disponibles
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: { xs: 48, sm: 56 }, 
                  height: { xs: 48, sm: 56 }, 
                  borderRadius: 2, 
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <TrendingUpIcon sx={{ color: '#fff', fontSize: { xs: 24, sm: 28 } }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            width: '100%',
            borderRadius: 2, 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            height: '100%',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 2, sm: 0 } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Nouveaux Produits
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    {newProductsThisMonth}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    Ce mois-ci
                  </Typography>
                </Box>
                <Box sx={{ 
                  width: { xs: 48, sm: 56 }, 
                  height: { xs: 48, sm: 56 }, 
                  borderRadius: 2, 
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <NewProductsIcon sx={{ color: '#fff', fontSize: { xs: 24, sm: 28 } }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Title and Actions */}
      <Box sx={{ mb: 4 }}>
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
              wordBreak: 'break-word',
            }}
          >
            Mes Produits
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#94a3b8', 
              letterSpacing: 0.5,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Gérez vos produits ({filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''})
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'stretch', sm: 'flex-end' }, 
          mb: 3,
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #00b8d4 100%)',
              color: '#000',
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(0, 212, 255, 0.4)',
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                background: '#00b8d4',
                boxShadow: '0 6px 20px rgba(0, 212, 255, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Ajouter un Produit
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1, sm: 2 }, 
        mb: 3, 
        flexWrap: 'wrap',
        flexDirection: { xs: 'column', sm: 'row' },
      }}>
        <TextField
          placeholder="Rechercher un produit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 250 },
            width: { xs: '100%', sm: 'auto' },
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(17, 17, 17, 0.8)',
              borderRadius: 2,
              color: '#ffffff',
              '& fieldset': {
                borderColor: 'rgba(0, 212, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 212, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00d4ff',
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff',
              '&::placeholder': {
                color: '#94a3b8',
                opacity: 1,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#00d4ff' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{
            borderColor: 'rgba(0, 212, 255, 0.3)',
            color: '#ffffff',
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            '&:hover': {
              borderColor: 'rgba(0, 212, 255, 0.5)',
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
            },
          }}
        >
          Filtres
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: 'rgba(0, 212, 255, 0.3)',
            color: '#ffffff',
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            '&:hover': {
              borderColor: 'rgba(0, 212, 255, 0.5)',
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
            },
          }}
        >
          Trier par
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
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
              <TableCell padding="checkbox" sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                py: { xs: 2, sm: 2.5 },
              }}>
                <Checkbox
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < getCurrentPageProducts().length}
                  checked={getCurrentPageProducts().length > 0 && selectedProducts.length === getCurrentPageProducts().length}
                  onChange={handleSelectAll}
                  sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#00d4ff' } }}
                />
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 70, sm: 100 },
              }}>Image</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 150, sm: 200 },
              }}>Nom du Produit</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                minWidth: { xs: 100, sm: 120 },
              }}>Prix</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                display: { xs: 'none', md: 'table-cell' },
                minWidth: 120,
              }}>Catégorie</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                display: { xs: 'none', lg: 'table-cell' },
                minWidth: 120,
              }}>Tailles</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                display: { xs: 'none', lg: 'table-cell' },
                minWidth: 120,
              }}>Couleurs</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: { xs: '0.8rem', sm: '0.95rem' },
                display: { xs: 'none', sm: 'table-cell' },
                minWidth: 80,
              }}>Stock</TableCell>
              <TableCell sx={{ 
                fontWeight: 800,
                color: '#00d4ff',
                fontSize: '0.95rem',
              }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageProducts().length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                    {searchQuery ? 'Aucun produit trouvé pour votre recherche' : 'Aucun produit trouvé. Ajoutez votre premier produit!'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageProducts().map((product, rowIdx) => (
                <TableRow 
                  key={String(product.id || product._id || `product-${rowIdx}`)} 
                  hover
                  selected={selectedProducts.includes(String(product.id || product._id || ''))}
                  sx={{
                    borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                    backgroundColor: 'rgba(17, 17, 17, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 212, 255, 0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProducts.includes(String(product.id || product._id || ''))}
                      onChange={() => handleSelectProduct(String(product.id || product._id || ''))}
                      sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#00d4ff' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: { xs: 70, sm: 100 } }}>
                    <Box
                      sx={{
                        width: { xs: 50, sm: 70 },
                        height: { xs: 50, sm: 70 },
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f4f6',
                        position: 'relative',
                      }}
                    >
                      {(() => {
                        const imageUrl = product.Product_img?.[0];
                        const imageSrc = typeof imageUrl === 'string' 
                          ? imageUrl 
                          : (imageUrl?.url || imageUrl || null);
                        
                        return imageSrc ? (
                          <Box
                            component="img"
                            src={imageSrc}
                            alt={product.Product_name || 'Product image'}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <InventoryIcon sx={{ fontSize: 28, color: '#9ca3af' }} />
                        );
                      })()}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#ffffff',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    minWidth: { xs: 150, sm: 200 },
                  }}>
                    {product.Product_name}
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: 700, 
                    color: '#00d4ff',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    minWidth: { xs: 100, sm: 120 },
                  }}>
                    {product.Product_price?.toLocaleString()} DZD
                  </TableCell>
                  <TableCell sx={{ 
                    display: { xs: 'none', md: 'table-cell' },
                  }}>
                    <Chip 
                      label={product.Product_category} 
                      size="small" 
                      sx={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 100%)',
                        color: '#3b82f6',
                        fontWeight: 700,
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    color: '#ffffff', 
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    display: { xs: 'none', lg: 'table-cell' },
                  }}>
                    {product.Product_sizes?.slice(0, 3).join(', ')}
                    {product.Product_sizes?.length > 3 && '...'}
                  </TableCell>
                  <TableCell sx={{ 
                    display: { xs: 'none', lg: 'table-cell' },
                  }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {product.Product_color?.slice(0, 3).map((color, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: '2px solid rgba(59, 130, 246, 0.3)',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                          }}
                        />
                      ))}
                      {product.Product_color?.length > 3 && '...'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    display: { xs: 'none', sm: 'table-cell' },
                    color: '#ffffff',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  }}>
                    {product.stock || 0}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenDialog(product)}
                      size="small"
                      sx={{
                        color: '#00d4ff',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 212, 255, 0.15)',
                          transform: 'scale(1.15)',
                          boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                        },
                        transition: 'all 0.3s ease',
                        mr: 0.5,
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(product)}
                      size="small"
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Stack>
        </Box>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'auto',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: '#1e293b',
            color: '#ffffff',
            fontWeight: 700,
            py: 2.5,
            px: 3,
            borderBottom: '2px solid #334155',
          }}
        >
          <Typography sx={{ 
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}>
            {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            sx={{ 
              position: 'absolute', 
              right: 12, 
              top: 12,
              color: '#94a3b8',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3, backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du Produit *"
                value={formData.Product_name}
                onChange={(e) => handleInputChange('Product_name', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    color: '#111827',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                      boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6b7280',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                      fontWeight: 700,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#111827',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.Product_desctiption}
                onChange={(e) => handleInputChange('Product_desctiption', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    color: '#111827',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                      boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6b7280',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                      fontWeight: 700,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#111827',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prix *"
                type="number"
                value={formData.Product_price}
                onChange={(e) => handleInputChange('Product_price', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    color: '#111827',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                      boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6b7280',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                      fontWeight: 700,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#111827',
                  },
                }}
                InputProps={{
                  endAdornment: <Typography sx={{ ml: 1, color: '#94a3b8', fontWeight: 700 }}>DZD</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Catégorie *"
                value={formData.Product_category}
                onChange={(e) => handleInputChange('Product_category', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f9fafb',
                    borderRadius: 2,
                    color: '#111827',
                    '& fieldset': {
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                      boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6b7280',
                    '&.Mui-focused': {
                      color: '#3b82f6',
                      fontWeight: 700,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#111827',
                  },
                }}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ 
                  color: '#3b82f6',
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: '1rem',
                }}
              >
                Images du Produit *
              </Typography>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button 
                    variant="outlined" 
                    component="span"
                    sx={{
                      borderColor: 'rgba(59, 130, 246, 0.4)',
                      color: '#3b82f6',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                      },
                    }}
                  >
                    Ajouter des Images
                  </Button>
                </label>
              </Box>
              {(productImages.length > 0 || newImages.length > 0) && (
                <ImageList cols={3} gap={8} sx={{ maxHeight: 300 }}>
                  {productImages.map((img, idx) => {
                    // Extract URL string from image (handle both string URLs and objects)
                    const imageUrl = typeof img === 'string' 
                      ? img 
                      : (img?.url || img?.secure_url || img?.formats?.medium?.url || '');
                    
                    if (!imageUrl) return null;
                    
                    return (
                      <ImageListItem 
                      key={`existing-${String(idx)}`}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid #e5e7eb',
                        '&:hover': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <img src={imageUrl} alt={`Product ${idx}`} loading="lazy" />
                      <ImageListItemBar
                        sx={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                        }}
                        actionIcon={
                          <IconButton
                            sx={{ 
                              color: '#fff',
                              '&:hover': {
                                color: '#fff',
                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                              },
                            }}
                            onClick={() => handleRemoveImage(idx, false)}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                    );
                  })}
                  {newImages.map((img, idx) => {
                    // Ensure img is a File/Blob object before creating object URL
                    if (!(img instanceof File || img instanceof Blob)) {
                      console.warn('Invalid image file:', img);
                      return null;
                    }
                    
                    const objectUrl = URL.createObjectURL(img);
                    
                    return (
                      <ImageListItem 
                        key={`new-${String(idx)}`}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '2px solid #e5e7eb',
                          '&:hover': {
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <img src={objectUrl} alt={`New ${idx}`} loading="lazy" />
                        <ImageListItemBar
                          sx={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                          }}
                          actionIcon={
                            <IconButton
                              sx={{ 
                                color: '#fff',
                                '&:hover': {
                                  color: '#fff',
                                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                },
                              }}
                              onClick={() => handleRemoveImage(idx, true)}
                            >
                              <CloseIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    );
                  })}
                </ImageList>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ 
                  color: '#3b82f6',
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: '1rem',
                }}
              >
                Tailles Disponibles
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {PRODUCT_SIZES.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onClick={() => handleSizeToggle(size)}
                    sx={{
                      ...(formData.Product_sizes.includes(size) ? {
                        background: '#3b82f6',
                        color: '#fff',
                        border: '1px solid #3b82f6',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                        '&:hover': {
                          background: '#2563eb',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                        },
                      } : {
                        border: '1px solid #e5e7eb',
                        color: '#6b7280',
                        backgroundColor: '#f9fafb',
                        '&:hover': {
                          borderColor: '#3b82f6',
                          backgroundColor: '#eff6ff',
                          color: '#3b82f6',
                        },
                      }),
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography 
                variant="subtitle2" 
                gutterBottom
                sx={{ 
                  color: '#3b82f6',
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: '1rem',
                }}
              >
                Couleurs Disponibles
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {PRODUCT_COLORS.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    onClick={() => handleColorToggle(color)}
                    sx={{
                      ...(formData.Product_color.includes(color) ? {
                        background: '#3b82f6',
                        color: '#fff',
                        border: '1px solid #3b82f6',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                        '&:hover': {
                          background: '#2563eb',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                        },
                      } : {
                        border: '1px solid #e5e7eb',
                        color: '#6b7280',
                        backgroundColor: '#f9fafb',
                        '&:hover': {
                          borderColor: '#3b82f6',
                          backgroundColor: '#eff6ff',
                          color: '#3b82f6',
                        },
                      }),
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={() => setColorPickerOpen(true)}
                  sx={{ 
                    minWidth: 120,
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    color: '#3b82f6',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                    },
                  }}
                >
                  Couleur RGBA
                </Button>
              </Box>
              {formData.Product_color.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1 }}>
                  {formData.Product_color.map((color, idx) => (
                    <Box
                      key={String(color || idx)}
                      sx={{
                        width: 45,
                        height: 45,
                        borderRadius: 2,
                        backgroundColor: color,
                        border: '2px solid #3b82f6',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)',
                        },
                      }}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          Product_color: prev.Product_color.filter((_, i) => i !== idx),
                        }));
                      }}
                    >
                      <CloseIcon
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          fontSize: 20,
                          color: '#fff',
                          backgroundColor: '#ef4444',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          '&:hover': {
                            backgroundColor: '#ef4444',
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#374151',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: '#2563eb',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {editingProduct ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Picker Dialog */}
      <Dialog 
        open={colorPickerOpen} 
        onClose={() => setColorPickerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            background: '#f5f5f5',
            border: '1px solid #e5e7eb',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: '#1e293b',
            color: '#ffffff',
            fontWeight: 700,
            py: 2.5,
            px: 3,
            borderBottom: '2px solid #334155',
          }}
        >
          <Typography sx={{ 
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}>
            Choisir une Couleur RGBA
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <SketchPicker
              color={customColor}
              onChange={(color) => setCustomColor(color.hex)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
          <Button 
            onClick={() => setColorPickerOpen(false)}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#374151',
              },
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAddCustomColor} 
            variant="contained"
            sx={{
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: '#2563eb',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={Boolean(deletingProduct)} 
        onClose={() => setDeletingProduct(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(239, 68, 68, 0.2)',
            background: 'rgba(17, 17, 17, 0.98)',
            border: '1px solid #e5e7eb',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: '#1e293b',
            color: '#ffffff',
            fontWeight: 700,
            py: 2.5,
            px: 3,
            borderBottom: '2px solid #334155',
          }}
        >
          <Typography sx={{ 
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}>
            Confirmer la Suppression
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
          <Typography sx={{ color: '#374151', fontSize: '1rem' }}>
            Êtes-vous sûr de vouloir supprimer <strong style={{ color: '#3b82f6' }}>"{deletingProduct?.Product_name}"</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
          <Button 
            onClick={() => setDeletingProduct(null)}
            sx={{
              color: '#6b7280',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#374151',
              },
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained"
            sx={{
              background: '#ef4444',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: '#dc2626',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
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

export default ProductsManagement;

