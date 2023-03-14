import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  ModalOverlay,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import { BookCover } from "../Pages/Types/ShopTypes";
import { GetBookCoverType } from "../Helpers/GetBookCover";

interface Props {
  AddShopItem: (
    e: FormEvent<HTMLFormElement>,
    photo: string,
    name: string,
    price: number,
    description: string,
    pageNumber: number,
    language: string,
    bookCoverType: string,
    publisher: string,
    releaseDate: string
  ) => void;
}

const AddNewShopItem = ({ AddShopItem }: Props) => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);

  const [photo, setPhoto] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>();
  const [language, setLanguage] = useState<string>("");
  const [bookCoverType, setBookCoverType] = useState<string>("");
  const [publisher, setPublisher] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");

  const onNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value as string);
  };
  const onPriceChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPrice(e.target.value as unknown as number);
  };
  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setDescription(e.target.value as string);
  };
  const onPageNumberChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPageNumber(e.target.value as unknown as number);
  };
  const onLanguageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLanguage(e.target.value as string);
  };
  const onBookCoverTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setBookCoverType(e.target.value as string);
  };
  const onPublisherChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPublisher(e.target.value as string);
  };
  const onReleaseDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setReleaseDate(e.target.value as string);
  };
  const onPhotoChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files) {
      const file = e.target.files[0];
      const test = new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            resolve(event.target.result);
          }
        };

        reader.onerror = (err) => {
          reject(err);
        };

        reader.readAsDataURL(file);
      });
      const temp = (await test) as string;
      setPhoto(temp.split(",")[1]);
    }
  };

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" width={"325px"}>
        <Button
          cursor={"pointer"}
          width="100%"
          height="100%"
          fontSize={"200%"}
          color={"grey"}
          onClick={() => {
            setOverlay(<OverlayOne />);
            onOpen();
          }}
        >
          Pridėti naują prekę
        </Button>
      </Box>
      <Modal
        isOpen={isOpen}
        initialFocusRef={initialRef}
        onClose={onClose}
      >
        {overlay}
        <ModalContent>
          <form
            onSubmit={(e) =>
              AddShopItem(
                e,
                photo,
                name,
                price as number,
                description,
                pageNumber as number,
                language,
                bookCoverType,
                publisher,
                releaseDate
              )
            }
          >
            <ModalHeader>Naujos prekės pridėjimas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <HStack>
              <FormControl isRequired >
                <FormLabel>Pavadinimas</FormLabel>
                <Input type={"text"} onChange={(e) => onNameChange(e)} />
              </FormControl>
              <FormControl isRequired >
                <FormLabel>Kaina</FormLabel>
                <Input type={"number"} step={"0.01"} onChange={(e) => onPriceChange(e)} />
              </FormControl>
              </HStack>
              <FormControl isRequired mt={4}>
                <Box>
                  <FormLabel>Nuotrauka</FormLabel>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    onChange={(e) => onPhotoChange(e)}
                  />
                </Box>
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Aprašymas</FormLabel>
                <Textarea onChange={(e) => onDescriptionChange(e)} />
              </FormControl>
              <HStack mt={4}>
                <FormControl isRequired>
                  <FormLabel>Kalba</FormLabel>
                  <Input type={"text"} onChange={(e) => onLanguageChange(e)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Puslapių skaičius</FormLabel>
                  <Input
                    type={"number"}
                    onChange={(e) => onPageNumberChange(e)}
                  />
                </FormControl>
              </HStack>
              <HStack mt={4}>
                <FormControl isRequired>
                  <FormLabel>Leidėjas</FormLabel>
                  <Input type={"text"} onChange={(e) => onPublisherChange(e)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Leidinio data</FormLabel>
                  <Input
                    type={"number"}
                    onChange={(e) => onReleaseDateChange(e)}
                  />
                </FormControl>
              </HStack>
              <Select
                isRequired
                variant={"flushed"}
                mt={4}
                onChange={(e) => onBookCoverTypeChange(e)}
              >
                <option disabled selected>
                Pasirinkite lygį
                </option>
                <option value={BookCover.Soft}>
                  {GetBookCoverType(BookCover.Soft)}
                </option>
                <option value={BookCover.Hard}>
                  {GetBookCoverType(BookCover.Hard)}
                </option>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                bg={"blue.500"}
                color={"black"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Pateikti
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export { AddNewShopItem };
