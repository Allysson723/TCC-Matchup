package com.matchup.service;

import com.matchup.dto.InterestDependenciesDto;
import com.matchup.dto.InterestDto;
import com.matchup.dto.RequestDto;
import com.matchup.model.Interest;
import com.matchup.model.insterest.*;
import com.matchup.model.insterest.Company;
import com.matchup.repository.InterestRepository;
import com.matchup.repository.interest.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterestService {

    private final FilterSpecificationService<Interest> filterSpecificationService;

    private final InterestRepository interestRepository;
    private final AgeRatingRepository ageRatingRepository;
    private final GenreRepository genreRepository;
    private final SubGenreRepository subGenreRepository;
    private final LanguageRepository languageRepository;
    private final PlatformRepository platformRepository;
    private final CompanyRepository companyRepository;

    @Autowired
    public InterestService(FilterSpecificationService<Interest> filterSpecificationService, InterestRepository interestRepository, AgeRatingRepository ageRatingRepository, GenreRepository genreRepository, SubGenreRepository subGenreRepository, LanguageRepository languageRepository, PlatformRepository platformRepository, CompanyRepository companyRepository) {
        this.filterSpecificationService = filterSpecificationService;
        this.interestRepository = interestRepository;
        this.ageRatingRepository = ageRatingRepository;
        this.genreRepository = genreRepository;
        this.subGenreRepository = subGenreRepository;
        this.languageRepository = languageRepository;
        this.platformRepository = platformRepository;
        this.companyRepository = companyRepository;
    }


    // SAVE
    public Interest saveInterest(InterestDto interestDto){
        Interest interestToSave = new Interest();

        interestToSave.setName(interestDto.getName());
        interestToSave.setCompany(
                companyRepository.findById(interestDto.getCompanyId()).get());
        interestToSave.setLowestPrice(interestDto.getLowestPrice());
        interestToSave.setHighestPrice(interestDto.getHighestPrice());
        interestToSave.setAgeRating(
                ageRatingRepository.findById(interestDto.getAgeRatingId()).get());
        interestToSave.setDubbingLanguages(
                languageRepository.findByIdIn(interestDto.getDubbingLanguagesIdList()));
        interestToSave.setSubtitleLanguages(
                languageRepository.findByIdIn(interestDto.getSubtitleLanguagesIdList()));
        interestToSave.setGenres(
                genreRepository.findAllById(interestDto.getGenresIdList()));
        interestToSave.setSubGenres(
                subGenreRepository.findAllById(interestDto.getSubGenresIdList()));
        interestToSave.setPlatforms(
                platformRepository.findAllById(interestDto.getPlatformsIdList()));

        return interestRepository.save(interestToSave);
    }

    public List<Interest> getInterestsBySpecification(RequestDto requestDto){
        Specification<Interest> searchSpecification =
                filterSpecificationService.getSearchSpecification(requestDto.getSearchRequestDto(), requestDto.getGlobalOperator());
        return interestRepository.findAll(searchSpecification);
    }

    public Company saveCompany(Company company){
        return companyRepository.save(company);
    }

    public Language saveLanguage(Language language){
        return languageRepository.save(language);
    }

    public AgeRating saveAgeRating(AgeRating ageRating){
        return ageRatingRepository.save(ageRating);
    }

    public Genre saveGenre(Genre genre){
        return genreRepository.save(genre);
    }

    public SubGenre saveSubGenre(SubGenre subGenre){
        return subGenreRepository.save(subGenre);
    }

    public Platform savePlatform(Platform platform){
        return platformRepository.save(platform);
    }

    // GET ALL
    public List<Interest> getAllInterests(){
        return interestRepository.findAll();
    }

    public List<Company> getAllCompanies(){
        return companyRepository.findAll();
    }

    public List<Language> getAllLanguages(){
        return languageRepository.findAll();
    }

    public List<AgeRating> getAllAgeRatings(){
        return ageRatingRepository.findAll();
    }

    public List<Genre> getAllGenres(){
        return genreRepository.findAll();
    }

    public List<SubGenre> getAllSubGenres(){
        return subGenreRepository.findAll();
    }

    public List<Platform> getAllPlatforms(){
        return platformRepository.findAll();
    }

    public InterestDependenciesDto getInterestsDependencies() {
        InterestDependenciesDto interestDependenciesDto = new InterestDependenciesDto();
        interestDependenciesDto.setCompanies(companyRepository.findAll());
        interestDependenciesDto.setAgeRatings(ageRatingRepository.findAll());
        interestDependenciesDto.setGenres(genreRepository.findAll());
        interestDependenciesDto.setSubGenres(subGenreRepository.findAll());
        interestDependenciesDto.setPlatforms(platformRepository.findAll());
        return interestDependenciesDto;
    }
}
