import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { importAllImagesByDir } from '../utils';
import Typography from '@mui/material/Typography';

export const Home = () => {
  const itemData = importAllImagesByDir(require.context('../Assets/Images/home', false, /\.(png|jpe?g|svg)$/));
  return (

    <Box sx={{ width: '90%', height: 'auto', overflowY: 'scroll', margin: '2% auto' }}>
      <Typography variant="h3" component="div" gutterBottom align="center" sx={{ mt: 4 }}>
        Welcome to My Photography Portfolio
      </Typography>
      <ImageList variant="masonry" cols={3} gap={8}>
        {Object.keys(itemData).map((key) => (
          <ImageListItem key={itemData[key]}>
            <img
              srcSet={`${itemData[key]}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${itemData[key]}?w=248&fit=crop&auto=format`}
              alt={key}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>

  )

}
export default Home