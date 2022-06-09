import { Button, Box, Spinner, Center, Text } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = 0 }) => {
    const { data: images } = await api.get(`/images`, {
      params: {
        after: pageParam
      }
    })

    return images;
  }

  const { //Initial request to retrieve the data
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchImages,
    {
     getNextPageParam: (pages) => pages.after ?? null
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data).flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData}/>

        {hasNextPage &&
          <Button onClick={() => fetchNextPage()}
                  loadingText='Carregando...'
                  isLoading={isFetchingNextPage}
                  mt={10}
                  >
                    Carregar mais
          </Button>
        }
      </Box>
    </>
  );
}
