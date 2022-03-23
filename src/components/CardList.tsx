import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure()

  const [selectedImage, setSelectedImage] = useState<string>('');

  function handleViewImage(url) {
    setSelectedImage(url); 
    onOpen();
  } 

  return (
    <>
      <SimpleGrid columns={3} gap={'40px'}>
        {cards?.map((card: Card) => {
          return <Card viewImage={handleViewImage} data={card}/>
        })} 
      </SimpleGrid >

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={selectedImage}/>
    </>
  );
}
