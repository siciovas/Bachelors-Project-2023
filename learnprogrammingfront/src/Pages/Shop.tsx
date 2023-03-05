import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Box, Image, Badge, Grid } from "@chakra-ui/react";
import { ShopTypes } from "./Types/ShopTypes";
import { useNavigate } from "react-router-dom";
import {
  useToast,
} from "@chakra-ui/react";
import { AddNewShopItem } from "../Components/AddNewShopItem";

const Shop = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShopTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const NavigateToItem = (shopItemId : number) => {
    navigate('/preke',{
      state:{
       id : shopItemId
      }
    })
  }

  const AddShopItem = useCallback(async (e: FormEvent<HTMLFormElement>, photo: string, name:string, price:number,
    description: string, pageNumber: number, language: string, bookCoverType: string, publisher: string, releaseDate: string): Promise<void> => {
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

    const data = await response.json();

    if (response.status === 201) {
      setIsLoading(true);
      toast({
        title: "Prekė pridėta",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      //onClose();
    } else {
      toast({
        title: "Nepavyko",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  },[]);

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
  }, []);

  useEffect(() => {
    getShopItems();
  }, [isLoading]);


  return (
    <Grid margin={20} templateColumns="repeat(4, 1fr)" gap={6}>
      <AddNewShopItem AddShopItem = {AddShopItem}/>
      {items.map((item) => {
        return (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image
              cursor={"pointer"}
              onClick={() => NavigateToItem(item.id)}
              maxWidth="100%"
              maxHeight="100%"
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
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

export { Shop };
