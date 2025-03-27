import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Menu, MenuItem } from '@mui/material'
import { ShoppingCart, Menu as MenuIcon } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [cartItems] = useState(0) // This will be managed by your cart context later

  const handleMenu = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: 1,
              '&:hover': {
                color: 'secondary.main',
                transition: 'color 0.3s ease'
              }
            }}
          >
            Akash Store
          </Typography>
        </motion.div>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {['Home', 'Products'].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Typography
                component={Link}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  '&:hover': { color: 'secondary.main' }
                }}
              >
                {item}
              </Typography>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              component={Link}
              to="/cart"
              color="primary"
              aria-label="cart"
            >
              <Badge badgeContent={cartItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </motion.div>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="primary"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <AnimatePresence>
              {Boolean(anchorEl) && (
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    component: motion.div,
                    initial: { opacity: 0, y: -20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 }
                  }}
                >
                  {['Home', 'Products'].map((item) => (
                    <MenuItem
                      key={item}
                      component={Link}
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar