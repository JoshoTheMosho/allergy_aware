import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import './Common.css';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const token = localStorage.getItem('access_token');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" className="custom-navbar">
            <Toolbar>
                <Typography
                    sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                >
                    <Typography
                        variant="h6"
                        className="logo-title"
                        component={Link}
                        to="/">
                        <img
                            src="https://res.cloudinary.com/dbujg1qso/image/upload/f_auto,q_auto/y8jjl4z9pe63ecy2vjwk"
                            alt="AllerGenie Logo"
                            className="logo-image"
                        />
                        AllerGenie
                    </Typography>
                </Typography>

                {isMobile ? (
                    <>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose} component={Link} to="/" className="mobile-menu-item">
                                Home
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/search" className="mobile-menu-item">
                                Search
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/edit" className="mobile-menu-item">
                                Edit
                            </MenuItem>
                            {!token && (
                                <MenuItem onClick={handleMenuClose} component={Link} to="/login" className="mobile-menu-item">
                                    Login
                                </MenuItem>
                            )}
                            {token && (
                                <MenuItem
                                    onClick={() => {
                                        localStorage.removeItem('access_token');
                                        localStorage.removeItem('refresh_token');
                                        window.location.href = '/';
                                    }}
                                    className="mobile-menu-item"
                                >
                                    Logout
                                </MenuItem>
                            )}
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/"
                            className="menu-item"
                        >
                            Home
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/search"
                            className="menu-item"
                        >
                            Search
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/edit"
                            className="menu-item"
                        >
                            Edit
                        </Button>
                        {!token && (
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                                className="menu-item"
                            >
                                Login
                            </Button>
                        )}
                        {token && (
                            <Button
                                color="inherit"
                                onClick={() => {
                                    localStorage.removeItem('access_token');
                                    localStorage.removeItem('refresh_token');
                                    window.location.href = '/';
                                }}
                                className="menu-item"
                            >
                                Logout
                            </Button>
                        )}
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
