import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Box,
  Image,
  Badge,
  Grid,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Button,
  Heading,
} from "@chakra-ui/react";
import { ShopTypes } from "../Types/ShopTypes";
import { useNavigate } from "react-router-dom";
import { AddNewShopItem } from "../Components/AddNewShopItem";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserRole } from "../Constants/RolesConstants";
import toast from "react-hot-toast";
// @ts-ignore
import Fade from "react-reveal/Fade";

const Shop = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem("role");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletingId, setDeletingId] = useState<number>();

  const NavigateToItem = (shopItemId: number) => {
    navigate("/preke", {
      state: {
        shopItemId: shopItemId,
      },
    });
  };

  const openModal = (id: number) => {
    setDeletingId(id);
    onOpen();
  };

  const AddShopItem = useCallback(
    async (
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
    ): Promise<void> => {
      e.preventDefault();
      const response = await fetch("https://localhost:7266/api/shop", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          photo,
          name,
          price,
          description,
          pageNumber,
          language,
          bookCoverType,
          publisher,
          releaseDate,
        }),
      });
      if (response.status === 201) {
        setIsLoading(true);
        toast.success("Prekė pridėta!");
        onClose();
      } else {
        toast.error("Nepavyko!");
      }
    },
    []
  );

  const getShopItems = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/shop`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    const allItems = await response.json();
    const reversedItems = [...allItems].reverse();
    setItems(reversedItems);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getShopItems();
  }, [isLoading]);

  const deleteShopItem = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    shopItemId: number
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(
      `https://localhost:7266/api/shop/${shopItemId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      setIsLoading(true);
      toast.success("Prekė ištrinta!");
      onClose();
    } else {
      toast.error("Nepavyko ištrinti!");
    }
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Flex mt={5} justify="center">
        <Heading size="lg" fontFamily={"Roboto"}>El. Parduotuvė</Heading>
      </Flex>
      {role === UserRole.Admin && <AddNewShopItem AddShopItem={AddShopItem} />}
      <Grid
        margin={20}
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(3, 1fr)",
          "2xl": "repeat(4, 1fr)",
        }}
        justifyContent={"center"}
        gap={3}
        mt={10}
      >
        {items.map((item) => {
          return (
            <Fade left>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                borderColor={"black"}
                width={"325px"}
                bg={"whitesmoke"}
              >
                <Image
                  cursor={"pointer"}
                  onClick={() => NavigateToItem(item.id)}
                  height="400px"
                  width="100%"
                  src={"data:image/jpeg;base64," + item.photo}
                />

                <Box p="6">
                  <Box display="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal">
                      {item.price} €
                    </Badge>
                    <Box
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      fontSize="xs"
                      textTransform="uppercase"
                      ml="2"
                    >
                      {item.pageNumber} puslapių &bull; {item.language} kalba
                    </Box>
                  </Box>

                  <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    noOfLines={1}
                    textTransform={"uppercase"}
                  >
                    {item.name}
                  </Box>
                  {role === UserRole.Admin && (
                    <>
                      <Flex justify="flex-end">
                        <DeleteIcon
                          cursor={"pointer"}
                          color={"red.500"}
                          onClick={() => openModal(item.id)}
                        />
                      </Flex>
                    </>
                  )}
                </Box>
              </Box>
            </Fade>
          );
        })}
      </Grid>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Perspėjimas!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Ar tikrai norite ištrinti prekę?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                background="red.500"
                mr={3}
                onClick={(e) => deleteShopItem(e, deletingId as number)}
                color="white"
                _hover={{
                  bg: "red.700",
                }}
              >
                Ištrinti
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export { Shop };
