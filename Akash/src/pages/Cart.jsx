import React, { useState } from 'react'
import { Box, Container, Typography, Grid, Card, CardMedia, IconButton, Button, Divider } from '@mui/material'
import { Add, Remove, Delete } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Gaming Console',
      price: 499.99,
      quantity: 1,
      image: '/images/Wuthering Waves Screenshot 2025.02.26 - 12.08.08.81.png'
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 799.99,
      quantity: 1,
      image: '/images/PXL_20240730_120132807.MV.jpg'
    }
  ])

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      x: 20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <Container sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
          Your Shopping Cart
        </Typography>
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: 8
            }}
          >
            <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </Button>
          </Box>
        </motion.div>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    exit="exit"
                  >
                    <Card
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      <Grid container>
                        <Grid item xs={4}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.image}
                            alt={item.name}
                            sx={{ objectFit: 'cover' }}
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>
                              {item.name}
                            </Typography>
                            <Typography variant="h6" color="primary" gutterBottom>
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 'auto'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                  onClick={() => updateQuantity(item.id, -1)}
                                  size="small"
                                  component={motion.button}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Remove />
                                </IconButton>
                                <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                <IconButton
                                  onClick={() => updateQuantity(item.id, 1)}
                                  size="small"
                                  component={motion.button}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                              <IconButton
                                onClick={() => removeItem(item.id)}
                                color="error"
                                sx={{ ml: 'auto' }}
                                component={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography>${calculateTotal().toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping</Typography>
                    <Typography>Free</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default Cart