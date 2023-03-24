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
  Spinner,
  Grid,
} from "@chakra-ui/react";
import { ShopTypes } from "../Types/ShopTypes";
import { useLocation } from "react-router-dom";
import { BookCover } from "../Types/ShopTypes";
import { GetBookCoverType } from "../Helpers/GetBookCover";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import toast from "react-hot-toast";

const ShopItemPage = () => {
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopTypes>();
  const [suggestions, setSuggestions] = useState<ShopTypes[]>([]);
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const getShopItems = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/shop/${state.shopItemId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const allItems = await response.json();
      setItems(allItems);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  const getShopSuggestions = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/shop/suggestions/${state.shopItemId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const allItems = await response.json();
      setSuggestions(allItems);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  const postToShoppingCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
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
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    }
    if (response.status === 201) {
      toast.success("Pridėta į krepšelį!");
    } else {
      toast.error("Nepavyko!");
    }
  };

  useEffect(() => {
    getShopItems();
    getShopSuggestions();
  }, [isLoading]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box className="container mt-5 mb-5">
      <Box border={"none"} overflow={"hidden"}>
        <Box className="row g-0">
          <Box className="col-md-6 border-end" height={"515px"}>
            <Box className="d-flex flex-column justify-content-center">
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                height={"100%"}
                overflow={"hidden"}
              >
                <Image
                  src={"data:image/jpeg;base64," + items?.photo}
                  width="350px"
                />
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
                <Text>
                  Viršelio tipas:{" "}
                  {GetBookCoverType(items?.bookCoverType as BookCover)}
                </Text>
                <Text>Leidinio data: {items?.releaseDate}</Text>
              </Box>
            </Box>
            <Flex ml={5} flexDirection={"row"} mt={5} gap={3}>
              <Button
                colorScheme={"cyan"}
                borderRadius={"50px 50px 50px 50px"}
                onClick={(e) => postToShoppingCart(e)}
              >
                Į KREPŠELĮ
              </Button>
            </Flex>
          </Box>
          <Divider mt={3} />
          <Heading mt={3} size={"lg"} textAlign={"center"}>
            Rekomenduojame
          </Heading>
          <Grid
            templateColumns="repeat(3, 1fr)"
            className="suggestions"
            mt={10}
            mb={10}
          >
            {suggestions.map((suggestion) => {
              return (
                <Flex flexDirection="column" className="suggestion">
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    width={"325px"}
                    position="relative"
                  >
                    <Image
                      cursor={"pointer"}
                      height="400px"
                      width="100%"
                      src={"data:image/jpeg;base64," + suggestion.photo}
                    />
                    <Flex
                      width={"100%"}
                      justifyContent={"center"}
                      position={"absolute"}
                      color={"white"}
                      top="50%"
                      fontWeight={"bold"}
                    >
                      {suggestion.name}
                    </Flex>
                  </Box>
                </Flex>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export { ShopItemPage };
