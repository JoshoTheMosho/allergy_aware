import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const token = localStorage.getItem('access_token');

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" className="custom-navbar">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        AllerGenie
                    </Link>
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/search">Search</Button>
                <Button color="inherit" component={Link} to="/edit">Edit</Button>
                {!token && (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
                {token && (
                    <Button color="inherit" onClick={() => {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('referesh_token');
                        window.location.href = '/';
                    }}>
                        Logout
                    </Button>
                )}
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/settings">Settings</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/help">Help</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar;
