import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Box, Image, Badge, Grid, Flex, Spinner } from "@chakra-ui/react";
import { ShopTypes } from "../Types/ShopTypes";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { AddNewShopItem } from "../Components/AddNewShopItem";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserRole } from "../Constants/RolesConstants";

const Shop = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const role = localStorage.getItem("role");


  const NavigateToItem = (shopItemId: number) => {
    navigate("/preke", {
      state: {
        id: shopItemId,
      },
    });
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
        toast({
          title: "Prekė pridėta",
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "Nepavyko",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
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
    setItems(allItems);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getShopItems();
  }, [isLoading]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
     {role === UserRole.Admin && (
      <AddNewShopItem AddShopItem={AddShopItem} />
     )}
      <Grid margin={20} templateColumns="repeat(4, 1fr)" gap={3} mt={10}>
        {items.map((item) => {
          return (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              width={"325px"}
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
                <Flex justify="flex-end">
                  <DeleteIcon cursor={"pointer"} />
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </>
  );
};

export { Shop };
