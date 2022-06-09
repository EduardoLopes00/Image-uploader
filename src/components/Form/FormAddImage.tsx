import { Box, Button, Stack, useToast, UseToastOptions } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type FormFields = {
  url: string,
  title: string,
  description: string
}

type ToastsStatus = "info" | "warning" | "success" | "error"



export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  function cleanAllStates() {
    setImageUrl('')
    setLocalImageUrl('')
  }

  function buildToast(title: string, description: string, status: ToastsStatus) {

    return toast({
      title,
      description,
      status,
      duration: 9000,
      isClosable: true,
    })
  }

  const formValidations = {
    image: {
      required: {value: true,
                 message: 'Arquivo obrigatório'},
      validate: {
        lessThan10MB: (value: unknown) => value[0].size < 10485760 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: (value: unknown) => /image\/(png|jpeg|gif)/.test(value[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
     }
    },
    title: {
      required: {value: true, message: 'Título obrigatório!' },
      minLength: {value: 2, message: 'Mínimo de 2 caracteres'},
      maxLength: {value: 20, message: 'Máximo de 20 caracteres'}

    },
    description: {
      required: {value: true,
        message: 'Descrição obrigatória'},

      maxLength: {value: 65,
        message: 'Máximo de 65 caracteres'},
    },
  };

  const sendImageToDB = (formFields: FormFields) => {
    const body = {...formFields}

    return api.post('/images', body)
  }

  const queryClient = useQueryClient();
  const mutation = useMutation('',(formFields: FormFields) => sendImageToDB(formFields),

    {
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();

  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        buildToast('Imagem não adicionada', 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro', 'info')
        return
      }

      const mutateData = {title: data.title, description: data.description, url: imageUrl} as FormFields

      await mutation.mutateAsync(mutateData)

      buildToast('Imagem cadastrada', 'imagem foi cadastrada com sucesso', 'success')


    } catch {
      buildToast('Falha no cadastro', 'Ocorreu um erro ao tentar cadastrar a sua imagem.', 'error')

    } finally {
      reset()
      cleanAllStates()
      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput 
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors['image']}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors['title']}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors['description']}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
