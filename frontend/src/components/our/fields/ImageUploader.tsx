import React, {ChangeEvent, useState} from 'react';
import {Button, Grid, IconButton, MobileStepper, Paper, Stack} from '@mui/material';
import {KeyboardArrowLeft, KeyboardArrowRight, Delete, Upload, Save} from '@mui/icons-material';
import {resizeImage} from "../../../utils/ResizeImage";
import {ClickAwayListener} from '@mui/base';

interface ImageUploaderProps {
    setImages: React.Dispatch<React.SetStateAction<File[]>>,
    calledByInterestCard: boolean,
    interestImageList: string[],
    userAccess: string,
    handleSave?: () => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         setImages,
                                                         calledByInterestCard,
                                                         interestImageList,
                                                         userAccess,
                                                         handleSave
                                                     }) => {
    const [selectedImages, setSelectedImages] = useState<string[]>(interestImageList);
    const [activeStep, setActiveStep] = useState(0);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray: File[] = Array.from(e.target.files);
            const resizedImages = await Promise.all(filesArray.map((file) => resizeImage(file, 800)));
            const fileUrls = resizedImages.map((file) => URL.createObjectURL(file));
            setSelectedImages(fileUrls);
            setImages(resizedImages);
            setActiveStep(0);
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleDelete = (index: number) => {
        setImages((prevImages) => prevImages.filter((image, i) => i !== index));
        setSelectedImages((prevImages) => prevImages.filter((image, i) => i !== index));
        setActiveStep((prevActiveStep) => prevActiveStep > 0 ? prevActiveStep - 1 : 0);
    };

    return (
        <Grid container alignItems="center">
            <Grid item md={12}>
                {userAccess == "ADMIN" && (<Button variant="contained" fullWidth component="label" sx={{alignItems: "center"}}>
                    <Upload sx={{mr: '13px'}}/> Adicionar Imagens
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleImageChange}
                    />
                </Button>)}
            </Grid>
            {selectedImages.length > 0 && (
                <Grid item md={12}/*justifyContent={'center'}*/>

                    <Grid container justifyContent="center" alignItems="center">
                        <img src={selectedImages[activeStep]} alt="Selected" height={"170px"} width={"auto"}/>
                    </Grid>
                    {userAccess == "ADMIN" && (
                        <Stack direction="row" display="flex" justifyContent="space-between" alignItems="center">
                            <IconButton sx={{color: 'primary', bgcolor: `theme.palette.background.default`}}
                                        onClick={() => handleDelete(activeStep)}>
                                <Delete/>
                            </IconButton>
                            {calledByInterestCard && (
                                <IconButton sx={{color: 'primary', bgcolor: `theme.palette.background.default`}}
                                            onClick={() => {
                                                if (handleSave) handleSave();
                                            }}>
                                    <Save/>
                                </IconButton>)}
                        </Stack>
                    )}

                        <MobileStepper
                            steps={selectedImages.length}
                            position="static"
                            variant="text"
                            activeStep={activeStep}
                            nextButton={
                                <Button size="small" onClick={handleNext}
                                        disabled={activeStep === selectedImages.length - 1}>
                                    Próximo
                                    <KeyboardArrowRight/>
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    <KeyboardArrowLeft/>
                                    Voltar
                                </Button>
                            }
                        />


                </Grid>
            )}
        </Grid>
    );
};


export default ImageUploader;
