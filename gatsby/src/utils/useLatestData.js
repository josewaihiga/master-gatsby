import { useEffect, useState } from 'react';

const gql = String.raw;
const deetsPseudoFragment = `
  name
    _id
    image {
      asset {
        url
        metadata {
          lqip
        }
      }
    }
`;

export default function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();
  // Use a side effect to fetch the data from the graphql endpoint

  useEffect(function () {
    // when the component loads, fetch the data
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemaster {
                ${deetsPseudoFragment}
              }
              hotSlices {
                ${deetsPseudoFragment}
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: check for errors

        // set the data to state
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log('Whoops');
        console.log(err);
      });
  }, []);

  return {
    hotSlices,
    slicemasters,
  };
}
