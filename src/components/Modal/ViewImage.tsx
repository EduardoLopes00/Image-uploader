import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Text,
  Center
} from '@chakra-ui/react';



interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {

  return (
  <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
       
        <ModalContent backgroundColor='gray.800'>
          <ModalBody m='0' p='0'>
            
              <Image w="100%" h="100%" mw="900px" mh="600px" src={imgUrl} />
            
          </ModalBody>
          <ModalFooter p={2} justifyContent='flex-start'>
            <Link isExternal href={imgUrl}>Abrir original</Link>         
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
    
}
