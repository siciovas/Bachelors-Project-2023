import React, { useCallback, useEffect, useState } from "react";
import { Box, Image, Badge, Grid } from "@chakra-ui/react";
import { ShopItem } from "./Types/ShopItemTypes";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopItem[]>([]);

  const getShopItems = useCallback(async () => {
    const items = await fetch(`https://localhost:7266/api/shop`, {
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
    <Grid margin={20} templateColumns="repeat(4, 1fr)" gap={6}>
      {items.map((item) => {
        return (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image
              cursor={"pointer"}
              onClick={() => navigate("/preke")}
              maxWidth="100%"
              maxHeight="100%"
              src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg"
            />

            <Box p="6">
              <Box display="flex" alignItems="baseline">
                <Badge borderRadius="full" px="2" colorScheme="teal">
                  {item.price}
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
              >
                {item.name}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

export { Shop };
