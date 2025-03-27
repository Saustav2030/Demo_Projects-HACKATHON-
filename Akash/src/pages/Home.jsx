import React from 'react'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'
import { motion } from 'framer-motion'

const Home = () => {
  const categories = [
    { name: 'Electronics', image: '/images/PXL_20240730_120132807.MV.jpg' },
    { name: 'Gaming', image: '/images/Wuthering Waves Screenshot 2025.02.26 - 12.08.08.81.png' },
    { name: 'Accessories', image: '/images/Wuthering Waves Screenshot 2025.02.26 - 12.09.02.28.png' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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
    <Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography
            variant="h2"
            component={motion.h2}
            sx={{ mb: 2, fontWeight: 700 }}
          >
            Welcome to Akash Store
          </Typography>
          <Typography
            variant="h5"
            component={motion.h5}
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Discover Amazing Products at Great Prices
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Shop Now
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography
            variant="h3"
            component={motion.h3}
            variants={itemVariants}
            sx={{ mb: 6, textAlign: 'center' }}
          >
            Shop by Category
          </Typography>

          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} md={4} key={category.name}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: 8
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={category.image}
                      alt={category.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {category.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2 }}
                      >
                        View Products
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Home