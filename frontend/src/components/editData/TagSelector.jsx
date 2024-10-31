import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';

const TagSelector = ({ tags, setTags }) => {
    const availableTags = ['Vegan', 'Gluten Free', 'Nut Free'];

    const toggleTag = (tag) => {
        setTags((prevTags) =>
            prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    return (
        <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Tags
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {availableTags.map((tag) => (
                    <FormControlLabel
                        key={tag}
                        control={
                            <Checkbox
                                checked={tags.includes(tag)}
                                onChange={() => toggleTag(tag)}
                                color="primary"
                            />
                        }
                        label={tag}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default TagSelector;
