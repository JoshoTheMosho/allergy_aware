import { Box, Typography, Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

const TagSelector = ({ tags, setTags, availableTags }) => {
    const handleTagChange = (event, newTags) => {
        setTags(newTags);
    };

    return (
        <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Tags
            </Typography>

            <Autocomplete
                multiple
                freeSolo
                options={availableTags}
                value={tags}
                onChange={handleTagChange}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Select or Create Tags" placeholder="Tags" />
                )}
                sx={{ width: '100%' }}
            />
        </Box>
    );
};

export default TagSelector;
