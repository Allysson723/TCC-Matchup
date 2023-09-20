import React from 'react';
import {
    Avatar,
    Box,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import {Field, ErrorMessage, FieldProps} from 'formik';
import * as Yup from 'yup';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import logo from '../../img/logo-matchup3.png';

function formatZipcode(value: any) {
    if (!value) {
        return value;
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 4) {
        return onlyNums;
    }
    if (onlyNums.length <= 8) {
        return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5)}`;
    }
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 8)}`;
}

const SignUpStep2: React.FC = () => {
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <img src={logo+''} alt=""/>
                <Typography component="h1" variant="h5">
                    Faça Cadastro
                </Typography>

                {/*
                private int addressNumber;
                private String addressStreet;
                private String addressNeighborhood;
                private String addressCity;
                private String addressState;
                private String addressZipcode;
                */}

                <Field name="addressZipcode">
                    {({ field, meta, form }: FieldProps) => (
                        <TextField
                            {...field}
                            onChange={e => {
                                const formatted = formatZipcode(e.target.value);
                                form.setFieldValue(field.name, formatted);
                            }}
                            margin="normal"
                            required
                            fullWidth
                            id="zipcode"
                            label="CEP"
                            autoFocus
                            variant="outlined"
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                        />
                    )}
                </Field>
                <Field name="addressState">
                    {({field, meta}: FieldProps) => (
                        <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            id="state"
                            label="Estado"
                            variant="outlined"
                            error={(meta.touched && !!meta.error)}
                            helperText={(meta.touched && meta.error)}
                        />
                    )}
                </Field>
                <Field name="addressCity">
                    {({field, meta}: FieldProps) => (
                        <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            id="city"
                            label="Cidade"
                            variant="outlined"
                            error={(meta.touched && !!meta.error)}
                            helperText={(meta.touched && meta.error)}
                        />
                    )}
                </Field>
                <Field name="addressNeighborhood">
                    {({field, meta}: FieldProps) => (
                        <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            name="addressNeighborhood"
                            label="Bairro"
                            variant="outlined"
                            error={(meta.touched && !!meta.error)}

                        />
                    )}
                </Field>
                <Field name="addressStreet">
                    {({field, meta}: FieldProps) => (
                        <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            name="addressStreet"
                            label="Rua / Avenida"
                            variant="outlined"
                            error={(meta.touched && !!meta.error)}
                            helperText={(meta.touched && meta.error)}
                        />
                    )}
                </Field>
                <Field name="addressNumber">
                    {({field, meta}: FieldProps) => (
                        <TextField
                            {...field}
                            margin="normal"
                            required
                            fullWidth
                            name="addressNumber"
                            label="Número"
                            variant="outlined"
                            error={(meta.touched && !!meta.error)}
                            helperText={(meta.touched && meta.error)}
                        />
                    )}
                </Field>


            </Box>
        </Container>
    );
};

export default SignUpStep2;

