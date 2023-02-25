import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  UnorderedList,
  ListItem,
  Heading,
  Flex,
  Card,
  Badge,
} from "@chakra-ui/react";
import { ShopTypes } from "./Types/ShopTypes";
import { useLocation } from "react-router-dom";

const ShopItemPage = () => {
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopTypes>();
  const { state } = useLocation();

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
                <Image src="https://i.imgur.com/TAzli1U.jpg" width="350" />
              </Flex>
              <Box>
                <UnorderedList
                  justifyContent={"center"}
                  alignItems={"center"}
                  listStyleType={"none"}
                  display={"flex"}
                >
                  <ListItem
                    border={"2px solid #eee"}
                    cursor={"pointer"}
                    transition={"all 0.5s"}
                    _hover={{
                      border: "2px solid #000",
                    }}
                  >
                    <Image src="https://i.imgur.com/TAzli1U.jpg" width="70" />
                  </ListItem>
                  <ListItem>
                    <Image src="https://i.imgur.com/w6kEctd.jpg" width="70" />
                  </ListItem>
                  <ListItem>
                    <Image src="https://i.imgur.com/L7hFD8X.jpg" width="70" />
                  </ListItem>
                  <ListItem>
                    <Image src="https://i.imgur.com/6ZufmNS.jpg" width="70" />
                  </ListItem>
                </UnorderedList>
              </Box>
            </Box>
          </Box>
          <Box className="col-md-6">
            <Box className="p-3 right-side">
              <Box className="d-flex justify-content-between align-items-center">
                <Heading>{items?.name}</Heading>
              </Box>
              <Badge mt={5} borderRadius="full" px="3" colorScheme="cyan" fontSize={"md"}>
                {items?.price}€
              </Badge>
              <Box mt={5} pr={3}>{items?.description}</Box>
              <Box mt={5}>
                <Text className="fw-bold">PAPILDOMA INFORMACIJA</Text>
                <Text>Kalba: {items?.language}</Text>
                <Text>Puslapių skaičius: {items?.pageNumber}</Text>
                <Text>Leidėjas: {items?.publisher}</Text>
                <Text>Viršelio tipas: {items?.bookCoverType}</Text>
                <Text>Leidinio data: {items?.releaseDate}</Text>
              </Box>
            </Box>
            <Flex ml={5} flexDirection={"row"} mt={5} gap={3}>
              <Button colorScheme={"gray"} boxShadow="md">
                PIRKTI
              </Button>
              <Button colorScheme={"cyan"} boxShadow="md">
                Į KREPŠELĮ
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export { ShopItemPage };
