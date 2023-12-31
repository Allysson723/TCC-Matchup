import * as React from 'react';
import ProductHeroLayout from './ProductHeroLayout';
import {Button, Typography} from "@mui/material";
import {useEffect, useState} from "react";
// @ts-ignore
import img1 from "../../img/img1.jpg";
// @ts-ignore
import img2 from '../../img/img2.jpg';
// @ts-ignore
import img3 from '../../img/img3.jpg';
// @ts-ignore
import img4 from '../../img/img4.jpg';
// @ts-ignore
import img5 from '../../img/img5.jpeg';
// @ts-ignore
import img6 from '../../img/img6.jpeg';
// @ts-ignore
import img7 from '../../img/img7.jpeg';
// @ts-ignore
import img8 from '../../img/img8.jpeg';
// @ts-ignore
import img9 from '../../img/img9.jpeg';
// @ts-ignore
import img10 from '../../img/img10.jpeg';
// @ts-ignore
import img11 from '../../img/img11.jpeg';
// @ts-ignore
import img12 from '../../img/img12.jpeg';
// @ts-ignore
import img13 from '../../img/img13.jpg';
// @ts-ignore
import img14 from '../../img/img14.jpg';
// @ts-ignore
import img15 from '../../img/img15.jpg';
// @ts-ignore
import img16 from '../../img/img16.jpg';
// @ts-ignore
import img17 from '../../img/img17.jpg';
import {useTheme} from "@mui/material/styles";


const Introduction = () => {
    const theme = useTheme();
    const [backgroundImages, setBackgroundImages] = useState([
        img1+'', img2+'', img3+'', img4+'', img5+'', img6+'', img7+'', img8+'', img9+'', img10+'',
        img11+'', img12+'', img13+'', img14+'', img15+'', img16+'', img17+'',
    ]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [backgroundImages]);


    return (
        <ProductHeroLayout
            sxBackground={{
                backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
                backgroundColor: '#0000', // Average color of the background image.
                backgroundPosition: 'center',
                filter: 'blur(4px)',
            }}
        >
            {/* Increase the network loading priority of the background image. */}
            <img
                style={{display: 'none'}}
                src={backgroundImages[currentImageIndex]}
                alt="increase priority"
            />
            <Typography align="center" variant={"h2"}> {/*color="inherit" align="center" variant="h2" marked="center"*/}

            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h5"
                sx={{mb: 4, mt: {xs: 4, sm: 10}}}
            >
                Ambiente que une os apaixonados por jogos
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h6"
                sx={{maxWidth: '650px'}}
            >
                Uma plataforma na qual você pode conhecer pessoas com interesses em comum sobre jogos na região, descobrir novos jogos perfeitos para você e passar horas interagindo nos chats e comunidades sobre o mundo gamer.
            </Typography>
            <Button
                variant="contained"
                size="large"
                component="a"
                href="/premium-themes/onepirate/sign-up/"
                sx={{minWidth: 200, marginTop: '70px'}}
            >
                DOWNLOAD
            </Button>
            <Typography variant="body2" color="inherit" sx={{mt: 2}}>
            </Typography>
        </ProductHeroLayout>
    );
}

export default Introduction;