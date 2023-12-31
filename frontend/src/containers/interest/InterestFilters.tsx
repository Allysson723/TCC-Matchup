import React, {useEffect, useState} from 'react';
import {
    Box,
    TextField,
    Grid, Switch, FormControlLabel, Stack, Typography,
} from '@mui/material';
import {languages} from "../../resources/languages";
import {useCustomTheme} from "../../contexts/CustomThemeContext";
import getTheme from "../../theme";
import {getAllInterestDependencies} from "../../api/interest_requests/registerInterest";
import MultipleSelect from "../../components/our/fields/MultipleSelect";
import {Filter, FILTERS_ATTRIBUTES, OPERATION, OPERATOR} from "../../model/filters";
import {getFilteredInterests} from "../../api/interest_requests/filterRequest";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import {InterestRequest} from "../../model/interest_filtered_request";
import {InterestDependency} from "../../model/interest";
import {styled, useTheme} from "@mui/material/styles";
import {useSelector} from "react-redux";
import {ROUTE_MY_PROFILE, ROUTE_PAGE_NOT_FOUND} from "../../routes";
import {getProfileByUsernameAndUserId} from "../../api/user_requests/profile";
import {Actions} from "usehooks-ts";


interface InterestFiltersProps {
    filteredInterests: InterestRequest | undefined,
    setFilteredInterests: React.Dispatch<React.SetStateAction<InterestRequest | undefined>>,
    username?: string | null | undefined,
    page: number,
    setTotalPages: (value: (((prevState: number) => number) | number)) => void,
    setPage: (value: (((prevState: number) => number) | number)) => void,
    map: Omit<Map<number, InterestRequest>, "set" | "clear" | "delete">,
    mapActions: Actions<number, InterestRequest>
}

const InterestFilters: React.FC<InterestFiltersProps> = ({
                                                             page,
                                                             username,
                                                             filteredInterests,
                                                             setFilteredInterests,
                                                             setTotalPages,
                                                             setPage,
                                                             map,
                                                             mapActions
                                                         }) => {

    const theme = useTheme();
    const {user} = useSelector((state: any) => state.app);
    const {token} = useSelector((state: any) => state.auth);


    const [name, setName] = useState<string>("");

    const [companies, setCompanies] = useState<InterestDependency[]>([]);
    const [selectedCompanies, setSelectedCompanies] = useState<InterestDependency[]>([]);

    const [ageRatings, setAgeRatings] = useState<InterestDependency[]>([]);
    const [selectedAgeRatings, setSelectedAgeRatings] = useState<InterestDependency[]>([]);

    const [lowestPrice, setLowestPrice] = useState<number | null>(null);
    const [highestPrice, setHighestPrice] = useState<number | null>(null);

    const [dubbingLanguages, setDubbingLanguages] = useState<InterestDependency[]>(languages);
    const [selectedDubbingLanguages, setSelectedDubbingLanguages] = useState<InterestDependency[]>([]);
    const [dubbingLanguagesOperator, setDubbingLanguagesOperator] = useState<string>(OPERATOR.OR);
    const [dubbingLanguagesSwitchChecked, setDubbingLanguagesSwitchChecked] = React.useState(false);

    const [subtitledLanguages, setSubtitledLanguages] = useState<InterestDependency[]>(languages);
    const [selectedSubtitledLanguages, setSelectedSubtitledLanguages] = useState<InterestDependency[]>([]);
    const [subtitledLanguagesOperator, setSubtitledLanguagesOperator] = useState<string>(OPERATOR.OR);
    const [subtitledLanguagesSwitchChecked, setSubtitledLanguagesSwitchChecked] = React.useState(false);

    const [genres, setGenres] = useState<InterestDependency[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<InterestDependency[]>([]);
    const [genresOperator, setGenresOperator] = useState<string>(OPERATOR.OR);
    const [genresSwitchChecked, setGenresSwitchChecked] = React.useState(false);

    const [subgenres, setSubgenres] = useState<InterestDependency[]>([]);
    const [selectedSubGenres, setSelectedSubGenres] = useState<InterestDependency[]>([]);
    const [subGenresOperator, setsubGenresOperator] = useState<string>(OPERATOR.OR);
    const [subgenresSwitchChecked, setSubgenresSwitchChecked] = React.useState(false);

    const [platforms, setPlatforms] = useState<InterestDependency[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<InterestDependency[]>([]);
    const [platformsOperator, setPlatformsOperator] = useState<string>(OPERATOR.OR);
    const [platformsSwitchChecked, setplatformsSwitchChecked] = React.useState(false);

    const [isLoggedUser, setIsLoggedUser] = React.useState(false);
    const [allInterestsSwitch, setAllInterestsSwitch] = React.useState(!user.hasInterests);


    useEffect(() => {
        if(map.has(page)) {
            console.log("requisição NÃO realizada");
            setFilteredInterests(map.get(page));
        }else{
            console.log("requisição realizada");
            fetchFilteredInterests(page);
        }
    }, [page]);

    const fetchFilteredInterests = async (page = 0) => {
        try {
            /*{
            "column": "id",
            "values": [2],
            "joinTable": "users",
            "operation": "JOIN",
            "operator": "AND"
        }*/
            const filters: Filter[] = [
                ...(username && !allInterestsSwitch ? [{
                    column: FILTERS_ATTRIBUTES.USERS.USERNAME,
                    values: [username],
                    joinTable: FILTERS_ATTRIBUTES.USERS.NAME,
                    operation: OPERATION.JOIN,
                    operator: OPERATOR.AND
                }] : []),
                ...(name ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST.NAME,
                    values: [name + ""],
                    operation: OPERATION.LIKE,
                    operator: OPERATOR.AND
                }] : []),
                ...(selectedCompanies && selectedCompanies.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedCompanies.map((c) => c.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.COMPANY_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: OPERATOR.OR
                }] : []),
                ...(selectedAgeRatings && selectedAgeRatings.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedAgeRatings.map((aR) => aR.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.AGE_RATING_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: OPERATOR.OR
                }] : []),
                ...(lowestPrice ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST.LOWEST_PRICE,
                    values: [lowestPrice + ""],
                    operation: OPERATION.GREATER_THAN,
                    operator: OPERATOR.AND
                }] : []),
                ...(highestPrice ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST.HIGHEST_PRICE,
                    values: [highestPrice + ""],
                    operation: OPERATION.LOWER_THAN,
                    operator: OPERATOR.AND
                }] : []),
                ...(selectedGenres && selectedGenres.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedGenres.map((g) => g.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.GENRE_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: genresOperator
                }] : []),
                ...(selectedSubGenres && selectedSubGenres.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedSubGenres.map((s) => s.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.SUBGENRE_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: subGenresOperator
                }] : []),
                ...(selectedDubbingLanguages && selectedDubbingLanguages.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedDubbingLanguages.map((dL) => dL.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.DUBBING_LANGUAGES_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: OPERATOR.OR
                }] : []),
                ...(selectedSubtitledLanguages && selectedSubtitledLanguages.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedSubtitledLanguages.map((sL) => sL.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.SUBTITLED_LANGUAGES_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: subtitledLanguagesOperator
                }] : []),
                ...(selectedPlatforms && selectedPlatforms.length > 0 ? [{
                    column: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.ID,
                    values: selectedPlatforms.map((sL) => sL.id + ""),
                    joinTable: FILTERS_ATTRIBUTES.INTEREST_DEPENDENCIES.PLATFORM_COLUMN_NAME,
                    operation: OPERATION.JOIN,
                    operator: platformsOperator
                }] : [])
            ]
            console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
            console.log(filters);
            const filteredInterests = await getFilteredInterests(filters, token, page, "name", "ASC", 200);

            if(page == 0){
                mapActions.reset();
                setPage(0);
                setTotalPages(filteredInterests.totalPages);
                mapActions.set(0, filteredInterests)
            }else{
                mapActions.set(page, filteredInterests)
            }
            setFilteredInterests(filteredInterests);
            return true;
        } catch (error) {
            console.error("Erro ao buscar interesses:", error);
        }
    };

    const handleSearch = async () => {
        await fetchFilteredInterests();
    };

    const handleSwitchChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setOperator: React.Dispatch<React.SetStateAction<string>>,
        checked: boolean,
        setChecked: React.Dispatch<React.SetStateAction<boolean>>) => {

        setChecked(event.target.checked);
        checked ? setOperator(OPERATOR.OR) : setOperator(OPERATOR.AND);
    };

    const loadDropdowns = async () => {
        try {
            let data = await getAllInterestDependencies();
            setCompanies(data.companies);
            setAgeRatings(data.ageRatings);
            setGenres(data.genres);
            setSubgenres(data.subGenres);
            setPlatforms(data.platforms);

        } catch (error) {
            console.error('Error loading dropdowns:', error);
        }
    };

    useEffect(() => {
        if (user.username == username) {
            setIsLoggedUser(true);
        }
        loadDropdowns();
        fetchFilteredInterests();
    }, []);


    useEffect(() => {
            if (user.username == username) {
                setIsLoggedUser(true);
            }
            loadDropdowns();
            fetchFilteredInterests();

        }, [username]
    );

    useEffect(() => {
            fetchFilteredInterests();
        }, [allInterestsSwitch]
    );

    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Stack p={3} spacing={2} sx={{maxHeight: "90vh", overflowY:"auto"}}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {isLoggedUser && (
                        <Stack direction="row" spacing={1} alignItems="center">

                            <Typography>Meus</Typography>
                            <Switch
                                checked={allInterestsSwitch}
                                onChange={(e) => {
                                    setAllInterestsSwitch(!allInterestsSwitch);
                                }}
                                inputProps={{'aria-label': 'controlled'}}
                            />
                            <Typography>Todos</Typography>

                        </Stack>

                    )}
                    <Grid item xs={12}>
                        <Grid container flexDirection={'row'} alignItems={'center'}>
                            <Grid item xs={11}>
                                <TextField
                                    autoFocus
                                    variant="outlined"
                                    required
                                    fullWidth
                                    onChange={(e) => setName(e.target.value)}
                                    label="Nome"
                                    placeholder={'Nome do jogo...'}
                                    onKeyPress={handleKeyPress}
                                />
                            </Grid>
                            <Grid item md={1}>
                                <IconButton
                                    sx={{ color: 'theme.palette.primary.main' }} onClick={handleSearch}>
                                    <SearchIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <MultipleSelect
                        fieldName={'company'}
                        label={'Empresas'}
                        placeholder={'Selecione as empresas:'}
                        options={companies}
                        selectedOptions={selectedCompanies}
                        setSelectedOptions={setSelectedCompanies}
                    />
                </Grid>

                <Grid item xs={12}>
                    <MultipleSelect
                        fieldName={'ageRating'}
                        label={'Classificação Indicativa'}
                        placeholder={'Selecione a classificação indicativa:'}
                        options={ageRatings}
                        selectedOptions={selectedAgeRatings}
                        setSelectedOptions={setSelectedAgeRatings}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        type="number"
                        label="Menor preço"
                        onChange={(e) => setLowestPrice(Number(e.target.value))}
                        inputProps={{min: 0, step: 0.01}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        type="number"
                        label="Maior preço"
                        onChange={(e) => setHighestPrice(Number(e.target.value))}
                        inputProps={{min: 0, step: 0.01}}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Grid container flexDirection={'row'} alignItems={'center'}>
                        <Grid item xs={10} width={"500px"}> {/*////////////////*/}
                            <MultipleSelect
                                fieldName={'dubbingLanguages'}
                                label={'Dublado'}
                                placeholder={'Selecione as linguagens dubladas:'}
                                options={dubbingLanguages}
                                selectedOptions={selectedDubbingLanguages}
                                setSelectedOptions={setSelectedDubbingLanguages}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <FormControlLabel control={
                                <Switch checked={dubbingLanguagesSwitchChecked}
                                        onChange={(e) => {
                                            handleSwitchChange(e, setDubbingLanguagesOperator, dubbingLanguagesSwitchChecked, setDubbingLanguagesSwitchChecked)
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}/>}
                                              label={dubbingLanguagesOperator}
                                              labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container flexDirection={'row'} alignItems={'center'}>
                        <Grid item xs={10}>
                            <MultipleSelect
                                fieldName={'subtitledLanguages'}
                                label={'Legendado'}
                                placeholder={'Selecione as linguagens legendadas:'}
                                options={subtitledLanguages}
                                selectedOptions={selectedSubtitledLanguages}
                                setSelectedOptions={setSelectedSubtitledLanguages}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <FormControlLabel control={
                                <Switch checked={subtitledLanguagesSwitchChecked}
                                        onChange={(e) => {
                                            handleSwitchChange(e, setSubtitledLanguagesOperator, subtitledLanguagesSwitchChecked, setSubtitledLanguagesSwitchChecked)
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}/>}
                                              label={subtitledLanguagesOperator}
                                              labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container flexDirection={'row'} alignItems={'center'}>
                        <Grid item xs={10}>
                            <MultipleSelect
                                fieldName={'genres'}
                                label={'Generos'}
                                placeholder={'Selecione os generos:'}
                                options={genres}
                                selectedOptions={selectedGenres}
                                setSelectedOptions={setSelectedGenres}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <FormControlLabel control={
                                <Switch checked={genresSwitchChecked}
                                        onChange={(e) => handleSwitchChange(e, setGenresOperator, genresSwitchChecked, setGenresSwitchChecked)}
                                        inputProps={{'aria-label': 'controlled'}}/>}
                                              label={genresOperator}
                                              labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container flexDirection={'row'} alignItems={'center'}>
                        <Grid item xs={10}>
                            <MultipleSelect
                                fieldName={'subGenres'}
                                label={'Sub Generos'}
                                placeholder={'Selecione os sub generos:'}
                                options={subgenres}
                                selectedOptions={selectedSubGenres}
                                setSelectedOptions={setSelectedSubGenres}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <FormControlLabel control={
                                <Switch checked={subgenresSwitchChecked}
                                        onChange={(e) => handleSwitchChange(e, setsubGenresOperator, subgenresSwitchChecked, setSubgenresSwitchChecked)}
                                        inputProps={{'aria-label': 'controlled'}}/>}
                                              label={subGenresOperator}
                                              labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container flexDirection={'row'} alignItems={'center'}>
                        <Grid item xs={10}>
                            <MultipleSelect
                                fieldName={'platforms'}
                                label={'Plataforma'}
                                placeholder={'Selecione as plataformas:'}
                                options={platforms}
                                selectedOptions={selectedPlatforms}
                                setSelectedOptions={setSelectedPlatforms}
                            />
                        </Grid>
                        <Grid item md={2}>
                            <FormControlLabel control={
                                <Switch checked={platformsSwitchChecked}
                                        onChange={(e) => handleSwitchChange(e, setPlatformsOperator, platformsSwitchChecked, setplatformsSwitchChecked)}
                                        inputProps={{'aria-label': 'controlled'}}/>}
                                              label={platformsOperator}
                                              labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            </Stack>
        </Box>
    );
};

export default InterestFilters;
