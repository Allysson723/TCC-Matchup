import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Typography} from "@mui/material";

function ProductSmokingHero() {
  return (
    <Container
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 9 }}
    >
      <Button
        sx={{
          border: '4px solid currentColor',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
        }}
      >
        <Typography variant="h4" component="span">
          Alguma pergunta? Precisa de ajuda?
        </Typography>
      </Button>
      <Typography variant="subtitle1" sx={{ my: 3 }}>
        Estamos aqui para ajudar. Entre em contato.
      </Typography>
    </Container>
  );
}

export default ProductSmokingHero;
