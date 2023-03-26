import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Select,
  Spinner,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { FiHome, FiShoppingCart } from "react-icons/fi";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { ShoppingCartTypes } from "../Types/ShoppingCartTypes";
import { CloseIcon } from "@chakra-ui/icons";
import EmptyCart from "./WebPhotos/emptycart.png";
import { BookCover } from "../Types/ShopTypes";
import { GetBookCoverType } from "../Helpers/GetBookCover";
import toast from "react-hot-toast";
import { isMobile } from "react-device-detect";

const steps = [
  {
    label: "1 žingsnis",
    description: "Krepšelio sąrašas",
    icon: FiShoppingCart,
  },
  { label: "2 žingsnis", description: "Pristatymo informacija", icon: FiHome },
];

const ShoppingCart = () => {
  const token = localStorage.getItem("accessToken");
  const [items, setItems] = useState<ShoppingCartTypes>();
  const [isLoading, setIsLoading] = useState(true);

  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const getShoppingCartItems = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/shoppingcart`, {
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

  const deleteShoppingCartItem = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    id: number
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(
      `https://localhost:7266/api/shoppingcart/${id}`,
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
    } else {
      toast.error("Nepavyko ištrinti!");
    }
  };

  useEffect(() => {
    getShoppingCartItems();
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
      {items?.shoppingCartItems.length === 0 ? (
        <>
          <Heading textAlign={"center"} mt={5}>
            Tuščias krepšelis
          </Heading>
          <Image margin={"auto"} mt={10} src={EmptyCart} />
        </>
      ) : (
        <>
          <Steps
            activeStep={activeStep}
            mt={3}
            maxW={{base: '100%', md: '50%'}}
            m={{base: "0", md: "auto"}}
            ml={isMobile ? "none" : "25%"}
            colorScheme={"green"}
          >
            {steps.map(({ label, description, icon }, index) => (
              <Step
                label={label}
                key={label}
                description={description}
                icon={icon}
              >
                {index === 0 ? (
                  <>
                    <Box py={10} px={10} overflowX="auto">
                      <Table
                        alignItems={"center"}
                      >
                        <Thead>
                          <Tr>
                            <Th>
                              Knyga
                            </Th>
                            <Th textAlign={"center"}>
                              Viršelio tipas
                            </Th>
                            <Th textAlign={"center"}>
                              Kiekis
                            </Th>
                            <Th textAlign={"center"}>
                              Kaina
                            </Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {items?.shoppingCartItems.map((item) => {
                            return (
                              <Tr
                                gap={4}
                                alignItems={"center"}
                                mb={3}
                              >
                                <Td>
                                  <Flex alignItems={"center"}>
                                    <Box m={"20px 15px 5px 15px"} display={{base: 'none', md:'block'}}>
                                      <Image
                                        src={
                                          "data:image/jpeg;base64," +
                                          item.product.photo
                                        }
                                        width={120}
                                        borderRadius={5}
                                      />
                                    </Box>
                                    <Heading size={"md"} fontWeight="normal">
                                      {item.product.name}
                                    </Heading>
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex justifyContent={"center"}>
                                    {GetBookCoverType(
                                      item?.product
                                        .bookCoverType as unknown as BookCover
                                    )}
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex justifyContent={"center"}>
                                    {item.quantity}
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex justifyContent={"center"}>
                                    {item.product.price} €
                                  </Flex>
                                </Td>
                                <Td>
                                  <Flex justify="center">
                                    <CloseIcon
                                      cursor={"pointer"}
                                      onClick={(e) =>
                                        deleteShoppingCartItem(e, item.id)
                                      }
                                    />
                                  </Flex>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                    <Flex flexDirection={"column"} pr={10}>
                      <Flex justifyContent={"end"} mb={3}>
                        <Flex flexDirection={"row"} gap={5}>
                          <Flex flexDirection={"column"}>
                            Suma
                            <Heading size={"sm"}>
                              {items?.cartPrice.toFixed(2)} €
                            </Heading>
                          </Flex>
                          <Flex flexDirection={"column"}>
                            Pristatymas
                            <Heading size={"sm"}>
                              {items?.shipping.toFixed(2)} €
                            </Heading>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Flex justifyContent={"end"}>
                        <Flex flexDirection={"column"} mr={7}>
                          Iš viso
                          <Heading size={"sm"}>
                            {items?.totalPrice.toFixed(2)} €
                          </Heading>
                        </Flex>
                      </Flex>
                    </Flex>
                  </>
                ) 
                : (
                  <>
                    <Flex mt={10} justifyContent={"center"} flexDir={{base: "column", md: "row"}}>
                      <Grid justifyContent={"center"}>
                        <Stack maxW={"lg"} px={6}>
                          <Stack align={"center"}>
                            <Heading fontSize={"4xl"} textAlign={"center"}>
                              Asmens duomenys
                            </Heading>
                          </Stack>
                          <Box
                            rounded={"lg"}
                            boxShadow={"lg"}
                            p={8}
                            height={"325px"}
                          >
                            <Stack spacing={4}>
                              <HStack>
                                <Box>
                                  <FormControl id="firstName" isRequired>
                                    <FormLabel>Vardas</FormLabel>
                                    <Input type="text" />
                                  </FormControl>
                                </Box>
                                <Box>
                                  <FormControl id="lastName" isRequired>
                                    <FormLabel>Pavardė</FormLabel>
                                    <Input type="text" />
                                  </FormControl>
                                </Box>
                              </HStack>
                              <HStack>
                                <FormControl id="email" isRequired>
                                  <FormLabel>El. Paštas</FormLabel>
                                  <Input type="email" />
                                </FormControl>
                                <FormControl id="email" isRequired>
                                  <FormLabel>
                                    Patvirtink savo el. paštą
                                  </FormLabel>
                                  <Input type="email" />
                                </FormControl>
                              </HStack>
                              <HStack>
                                <FormControl id="number" width={"30%"}>
                                  <FormLabel>Prefiksas</FormLabel>
                                  <Input
                                    type="number"
                                    isDisabled={true}
                                    placeholder={"+370"}
                                  />
                                </FormControl>
                                <FormControl id="text" isRequired>
                                  <FormLabel>Mob. telefono numeris</FormLabel>
                                  <Input
                                    type="text"
                                    pattern="[0-9]"
                                    maxLength={8}
                                  />
                                </FormControl>
                              </HStack>
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid justifyContent={"center"} mt={{base: 10, md: 0}}>
                        <Stack maxW={"lg"} px={6}>
                          <Stack align={"center"}>
                            <Heading fontSize={"4xl"} textAlign={"center"}>
                              Pristatymo duomenys
                            </Heading>
                          </Stack>
                          <Box
                            rounded={"lg"}
                            boxShadow={"lg"}
                            p={8}
                            height={"325px"}
                          >
                            <Stack spacing={4}>
                              <HStack>
                                <Box>
                                  <FormControl id="street" isRequired>
                                    <FormLabel>Gatvė</FormLabel>
                                    <Input type="text" />
                                  </FormControl>
                                </Box>
                                <Box>
                                  <FormControl id="address" isRequired>
                                    <FormLabel>Adresas</FormLabel>
                                    <Input type="text" />
                                  </FormControl>
                                </Box>
                              </HStack>
                              <HStack>
                                <FormControl id="zipcode" isRequired>
                                  <FormLabel>Pašto kodas</FormLabel>
                                  <Input type="text" />
                                </FormControl>
                                <FormControl id="city" isRequired>
                                  <FormLabel>Miestas</FormLabel>
                                  <Input type="text" />
                                </FormControl>
                              </HStack>
                              <Select isRequired variant={"flushed"}>
                                <option disabled selected>
                                  Pasirinkite rajoną
                                </option>
                                <option value="option1">Alytus</option>
                                <option value="option2">Kaunas</option>
                                <option value="option3">Klaipėda</option>
                                <option value="option4">Marijampolė</option>
                                <option value="option5">Tauragė</option>
                                <option value="option6">Telšiai</option>
                                <option value="option7">Utena</option>
                                <option value="option8">Vilnius</option>
                                <option value="option9">Šiauliai</option>
                              </Select>
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>
                    </Flex>
                  </>
                )}
              </Step>
            ))}
          </Steps>
          <Flex width="100%" justify="flex-end" mt={4} mb={{base: 5, md: 0}}>
             {activeStep !== 0 && (
              <Button justifyContent={"end"} mr={3} onClick={prevStep} borderRadius={"50px 50px 50px 50px"} bg={"red.500"} color={"white"}
                _hover={{
                  bg: "red.700",
                }}
              >
                Atgal
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button type="submit" justifyContent={"end"} mr={5} borderRadius={"50px 50px 50px 50px"} bg={"green.500"} color={"white"}
                _hover={{
                  bg: "green",
                }}
              >
                Apmokėti
              </Button>
            ) : (
              <Button justifyContent={"end"} onClick={nextStep} mr={10} borderRadius={"50px 50px 50px 50px"} bg={"green.500"} color={"white"}
                _hover={{
                  bg: "green",
                }}
              >
                Toliau
              </Button>
            )}
          </Flex>
        </>
      )}
    </>
  );
};
export { ShoppingCart };
