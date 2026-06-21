package codesquad.airdnd.domain.listing.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;

import codesquad.airdnd.domain.listing.dto.query.ListingSearchResponse;
import codesquad.airdnd.domain.listing.dto.query.MapBoundsFilter;
import codesquad.airdnd.domain.listing.dto.request.ListingSearchCondition;
import codesquad.airdnd.domain.listing.entity.ListingState;
import lombok.RequiredArgsConstructor;

import static codesquad.airdnd.domain.listing.entity.QListing.listing;

@Repository
@RequiredArgsConstructor
public class ListingQueryRepositoryImpl implements ListingQueryRepository {
	private final JPAQueryFactory queryFactory;

	@Override
	public Page<ListingSearchResponse> searchListings(ListingSearchCondition condition, Pageable pageable) {
		List<ListingSearchResponse> contents = queryFactory
			.select(
				Projections.constructor(
					ListingSearchResponse.class,
					listing.id,
					listing.address.latLng,
					listing.name,
					listing.capacity,
					listing.pricePerNight
				)
			)
			.from(listing)
			.where(
				listing.state.eq(ListingState.APPROVED),
				withinBounds(condition.mapBounds())
			)
			.orderBy(listing.id.desc())
			.offset(pageable.getOffset())
			.limit(pageable.getPageSize())
			.fetch();

		JPAQuery<Long> countQuery = queryFactory
			.select(listing.count())
			.from(listing)
			.where(
				listing.state.eq(ListingState.APPROVED),
				withinBounds(condition.mapBounds())
			);

		return PageableExecutionUtils.getPage(
			contents,
			pageable,
			countQuery::fetchOne
		);
	}

	private BooleanExpression withinBounds(MapBoundsFilter bounds) {
		if (bounds == null || !bounds.isPresent()) {
			return null;
		}

		return Expressions.numberTemplate(
			Integer.class,
			"MBRContains(ST_GeomFromText({0}, 4326, 'axis-order=long-lat'), {1})",
			bounds.toPolygonWkt(),
			listing.address.latLng
		).eq(1);
	}
}
