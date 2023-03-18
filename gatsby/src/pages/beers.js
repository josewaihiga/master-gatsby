import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import SEO from '../components/SEO';

const BeerGridStyles = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const SingleBeerStyles = styled.div`
  border: 1px solid var(--grey);
  padding: 2rem;
  text-align: center;
  img {
    width: 100%;
    height: 200px;
    object-fit: contain;
    display: grid;
    align-items: center;
    font-size: 10px;
    color: black;
  }
`;

export default function BeersPage({ data }) {
  const beers = data.beers.nodes;
  // console.log({ beers });
  return (
    <>
      <SEO title={`Beers! We have ${beers.length} in stock`} />
      <h2 className="center">
        We have {beers.length} Beers Available. Dine in Only!
      </h2>
      <BeerGridStyles>
        {beers.map((beer) => (
          <SingleBeer beer={beer} />
        ))}
      </BeerGridStyles>
    </>
  );
}

function SingleBeer({ beer }) {
  const rating = Math.round(beer.rating.average);

  return (
    <SingleBeerStyles>
      <img src={beer.image} alt={beer.name} />
      <h3>{beer.name}</h3>
      {beer.price}
      <p title={`${rating} out of 5 stars`}>
        {`⭐`.repeat(rating)}
        <span style={{ filter: `grayscale(100%)` }}>
          {`⭐`.repeat(5 - rating)}
        </span>
        <span>({beer.rating.reviews})</span>
      </p>
    </SingleBeerStyles>
  );
}

// [x] 1. Query the beers
// [x] 2. Loop through the nodes
// [x] 3. Map return single beer template for each node

export const query = graphql`
  query BeerQuery {
    beers: allBeer {
      nodes {
        id
        name
        price
        image
        rating {
          average
          reviews
        }
      }
    }
  }
`;
