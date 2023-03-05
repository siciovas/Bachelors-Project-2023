import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  Heading,
  Flex,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { ShopTypes } from "./Types/ShopTypes";
import { useLocation } from "react-router-dom";
import { BookCover } from "../Pages/Types/ShopTypes";
import { GetBookCoverType } from "../Helpers/GetBookCover";


const ShopItemPage = () => {
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopTypes>();
  const { state } = useLocation();
  const toast = useToast();
  
  const getShopItems = useCallback(async () => {
    const items = await fetch(`https://localhost:7266/api/shop/${state.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    const allItems = await items.json();
    setItems(allItems);
  }, []);

  useEffect(() => {
    getShopItems();
  }, []);

  const postToShoppingCart = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/shoppingcart", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        productId: items?.id,
      }),
    });

    if (response.status === 201) {
      toast({
        title: "Pridėtą į krepšelį",
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
  };


  return (
    <Box className="container mt-5 mb-5">
      <Box border={"none"} overflow={"hidden"}>
        <Box className="row g-0">
          <Box className="col-md-6 border-end">
            <Box className="d-flex flex-column justify-content-center">
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                borderBottom={"1px solid #eee"}
                height={400}
                overflow={"hidden"}
              >
                <Image src={"data:image/jpeg;base64," + items?.photo} width="350" />
              </Flex>
            </Box>
          </Box>
          <Box className="col-md-6">
            <Box className="p-3 right-side">
              <Box className="d-flex justify-content-between align-items-center">
                <Heading>{items?.name}</Heading>
              </Box>
              <Badge
                mt={5}
                borderRadius="full"
                px="3"
                colorScheme="cyan"
                fontSize={"md"}
              >
                {items?.price}€
              </Badge>
              <Box mt={5} pr={3}>
                {items?.description}
              </Box>
              <Box mt={5}>
                <Text className="fw-bold">PAPILDOMA INFORMACIJA</Text>
                <Text>Kalba: {items?.language}</Text>
                <Text>Puslapių skaičius: {items?.pageNumber}</Text>
                <Text>Leidėjas: {items?.publisher}</Text>
                <Text>Viršelio tipas: {GetBookCoverType(items?.bookCoverType as BookCover)}</Text>
                <Text>Leidinio data: {items?.releaseDate}</Text>
              </Box>
            </Box>
            <Flex ml={5} flexDirection={"row"} mt={5} gap={3}>
              <Button colorScheme={"cyan"} boxShadow="md" onClick={(e) => postToShoppingCart(e)}>
                Į KREPŠELĮ
              </Button>
            </Flex>
          </Box>
          <Divider mt={3} />
          <Heading mt={3} size={'lg'} textAlign={"center"}>Rekomenduojame</Heading>
        </Box>
      </Box>
    </Box>
  );
};

export { ShopItemPage };
