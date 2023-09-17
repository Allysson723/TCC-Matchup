package com.matchup.service;

import com.matchup.dto.RequestDto;
import com.matchup.dto.SearchRequestDto;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FilterSpecificationService<T> {
    public Specification<T> getSearchSpecification(List<SearchRequestDto> searchRequestDtos, RequestDto.GlobalOperator globalOperator){
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            for(SearchRequestDto requestDto: searchRequestDtos){
                Predicate predicate = null;

                switch (requestDto.getOperation()){
                    case EQUAL -> predicate  = criteriaBuilder.equal(root.get(requestDto.getColumn()), requestDto.getValue());
                    case LIKE -> predicate  = criteriaBuilder.like(root.get(requestDto.getColumn()), "%"+requestDto.getValue()+"%");
                    //case IN -> predicate  = criteriaBuilder.in(root.get(requestDto.getColumn()), requestDto.getValue());
                    case LOWER_THAN -> predicate  = criteriaBuilder.lessThanOrEqualTo(root.get(requestDto.getColumn()), requestDto.getValue());
                    case GREATER_THAN -> predicate  = criteriaBuilder.greaterThanOrEqualTo(root.get(requestDto.getColumn()), requestDto.getValue());
                    case JOIN -> predicate  = criteriaBuilder.equal(root.join(requestDto.getJoinTable()).get(requestDto.getColumn()), requestDto.getValue());
                    default -> throw new IllegalStateException("Invalid Operation");
                }


                predicates.add(predicate);
            }


            if(globalOperator.equals(RequestDto.GlobalOperator.AND)){
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }else if (globalOperator.equals(RequestDto.GlobalOperator.OR)){
                return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
            }else{
                throw new IllegalArgumentException("Invalid Global Operator");
            }
        };

    }
}
