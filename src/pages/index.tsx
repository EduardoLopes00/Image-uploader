import { Button, Box, Spinner, Center, Text } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  description: string
  id: string
  title: string
  ts: number
  url: string
}

export default function Home(): JSX.Element {
  
  const fetchImages = async ({ pageParam = 0 }) => api.get(`/images?after=${pageParam}`);
  
  const [allImages, setAllImages] = useState<Image[]>([]) 


  const { //Initial request to retrieve the data 
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchImages
    ,
    {
     getNextPageParam: (pages) => pages.data.after ?? null      
    }
  );

  
  const formattedData = useMemo(() => { 
   setAllImages(data?.pages.map( (page) => {
    return page.data.data.flat()
   }).flat())
    
  }, [data]);

  console.log('isLoading ', isLoading);
  console.log('isError ', isError);
  console.log('isFetchingNextPage ', isFetchingNextPage);
  console.log('fetchNextPage ', fetchNextPage);
  console.log('hasNextPage ', hasNextPage);  

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {isError && <Error />}
        
        {isLoading && 
          <Center >
            <Text size='xl' color='orange'>Carregando aplicação...</ Text>
          </Center>
        }

        {!isError && <CardList cards={allImages}/>}
        
        {hasNextPage && !isError && <Center >
          <Button onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} mt={10}>Load more...</Button>
        </Center> }

      </Box>
    </>
  );
}
