import React, { useState } from 'react'
import { Box, Container, Grid, Card, CardContent, CardMedia, Typography, Button, Chip, TextField, InputAdornment } from '@mui/material'
import { Search, ShoppingCart } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const products = [
    {
      id: 1,
      name: 'Gaming Console',
      price: 499.99,
      category: 'Gaming',
      image: '/images/Wuthering Waves Screenshot 2025.02.26 - 12.08.08.81.png',
      description: 'Next-gen gaming console for ultimate gaming experience'
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 799.99,
      category: 'Electronics',
      image: '/images/PXL_20240730_120132807.MV.jpg',
      description: 'Latest smartphone with advanced features'
    },
    {
      id: 3,
      name: 'Gaming Headset',
      price: 129.99,
      category: 'Accessories',
      image: '/images/Wuthering Waves Screenshot 2025.02.26 - 12.09.02.28.png',
      description: 'Premium gaming headset with surround sound'
    }
  ]

  const categories = ['All', ...new Set(products.map(product => product.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
            Our Products
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  sx={{ px: 2 }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: 8,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.image}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        sx={{
                          mt: 'auto',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </Container>
  )
}

export default Products