import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
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
import { BookCover } from "../Types/ShopTypes";
import { GetBookCoverType } from "../Helpers/GetBookCover";
import { isMobile } from "react-device-detect";
import { ShippingInformationTypes } from "../Types/ShippingInformationTypes";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import toast from "react-hot-toast";
import { OrderItemsTypes, OrderTypes } from "../Types/OrderTypes";
import moment from "moment";

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
  const [information, setInformation] = useState<ShippingInformationTypes>();
  const [isInformationExists, setIsInformationExists] = useState(false);
  const [order, setOrder] = useState<OrderTypes>();
  const [orderItems, setOrderItems] = useState<OrderItemsTypes>();
  const [isLoading, setIsLoading] = useState(true);

  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const handleFieldChange = (
    field: keyof typeof information,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    event.preventDefault();
    const newFields = { ...information } as ShippingInformationTypes;
    newFields[field] = event.target.value as never;
    console.log(newFields);
    setInformation(newFields);
  };

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
    getShippingInformation();
  }, [isLoading]);

  const getShippingInformation = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/shoppingcart/shipping`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    if (response.status === 200) {
      const information = await response.json();
      setInformation(information);
      setIsInformationExists(true);
    }
    setIsLoading(false);
  }, []);

  const postShippingInformation = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log(information);
    const response = await fetch(
      "https://localhost:7266/api/shoppingcart/shipping",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: isInformationExists ? "PUT" : "POST",
        body: JSON.stringify(information),
      }
    );
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    }
    if (response.status === 201 || response.status === 200) {
      var orderNumber = await postUnpaidOrder();
      console.log(orderNumber);
      await createPaymentRequest(orderNumber);
    } else {
      toast.error("Nepavyko!");
    }
  };

  const createPaymentRequest = async (orderNumber: string): Promise<void> => {
    const response = await fetch("https://localhost:7266/api/paysera", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        amount: (items?.totalPrice.toFixed(2) as unknown as number) * 100,
        email: information?.email,
        orderNumber,
      }),
    });
    if (response.status === 200) {
      const url = await response.text();
      window.location.replace(url);
    }
  };

  const postUnpaidOrder = async (): Promise<string> => {
    const response = await fetch("https://localhost:7266/api/order", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        orderTime: moment(order?.orderTime).format("yyyy-MM-DD HH:mm:ss"),
        total: items?.totalPrice.toFixed(2),
        orderItems: items?.shoppingCartItems.map((item) => {
          return {
            name: item.product.name,
            productId: item.product.id,
            photo: item.product.photo,
            price: item.product.price,
          };
        }),
      }),
    });
    const orderNumber = await response.text();
    return orderNumber;
    setIsLoading(false);
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
      {items?.shoppingCartItems.length === 0 ? (
        <>
          <Heading textAlign={"center"} mt={5}  fontFamily={"Roboto"}>
            Tuščias krepšelis
          </Heading>
          <Image
            margin={"auto"}
            mt={10}
            src={"/photos/WebPhotos/emptycart.png"}
          />
        </>
      ) : (
        <>
          <Steps
            activeStep={activeStep}
            maxW={{ base: "100%", md: "50%" }}
            m={{ base: "0", md: "auto" }}
            mt={{ base: "0", md: "auto", lg: "10" }}
            ml={isMobile ? "none" : "25%"}
            colorScheme={"gray"}
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
                      <Table alignItems={"center"}>
                        <Thead>
                          <Tr>
                            <Th>Knyga</Th>
                            <Th textAlign={"center"}>Viršelio tipas</Th>
                            <Th textAlign={"center"}>Kiekis</Th>
                            <Th textAlign={"center"}>Kaina</Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {items?.shoppingCartItems.map((item) => {
                            return (
                              <Tr gap={4} alignItems={"center"} mb={3}>
                                <Td>
                                  <Flex alignItems={"center"}>
                                    <Box
                                      m={"20px 15px 5px 15px"}
                                      display={{ base: "none", md: "block" }}
                                    >
                                      <Image
                                        src={
                                          "data:image/jpeg;base64," +
                                          item.product.photo
                                        }
                                        width={120}
                                        borderRadius={5}
                                      />
                                    </Box>
                                    <Heading size={"md"} fontWeight="normal" fontFamily={"Roboto"} textTransform="uppercase" >
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
                            <Heading size={"sm"}  fontFamily={"Roboto"}>
                              {items?.cartPrice.toFixed(2)} €
                            </Heading>
                          </Flex>
                          <Flex flexDirection={"column"}>
                            Pristatymas
                            <Heading size={"sm"}  fontFamily={"Roboto"}>
                              {items?.shipping.toFixed(2)} €
                            </Heading>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Flex justifyContent={"end"}>
                        <Flex flexDirection={"column"} mr={7}>
                          Iš viso
                          <Heading size={"sm"}  fontFamily={"Roboto"}>
                            {items?.totalPrice.toFixed(2)} €
                          </Heading>
                        </Flex>
                      </Flex>
                    </Flex>
                  </>
                ) : (
                  <>
                    <form onSubmit={(e) => postShippingInformation(e)}>
                      <Flex
                        mt={10}
                        justifyContent={"center"}
                        flexDir={{ base: "column", md: "row" }}
                      >
                        <Grid justifyContent={"center"}>
                          <Stack maxW={"lg"} px={6}>
                            <Stack align={"center"}>
                              <Heading fontSize={"4xl"} textAlign={"center"}  fontFamily={"Roboto"}>
                                Asmens duomenys
                              </Heading>
                            </Stack>
                            <Box
                              rounded={"lg"}
                              boxShadow={"lg"}
                              p={8}
                              height={"325px"}
                              bg={"white"}
                            >
                              <Stack spacing={4}>
                                <HStack>
                                  <Box>
                                    <FormControl id="firstName" isRequired>
                                      <FormLabel>Vardas</FormLabel>
                                      <Input
                                        type="text"
                                        onChange={(e) =>
                                          handleFieldChange("name" as never, e)
                                        }
                                        value={information?.name}
                                      />
                                    </FormControl>
                                  </Box>
                                  <Box>
                                    <FormControl id="lastName" isRequired>
                                      <FormLabel>Pavardė</FormLabel>
                                      <Input
                                        type="text"
                                        value={information?.surname}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            "surname" as never,
                                            e
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Box>
                                </HStack>
                                <FormControl id="email" isRequired>
                                  <FormLabel>El. Paštas</FormLabel>
                                  <Input
                                    type="email"
                                    value={information?.email}
                                    onChange={(e) =>
                                      handleFieldChange("email" as never, e)
                                    }
                                  />
                                </FormControl>
                                <FormControl id="email" isRequired>
                                  <FormLabel>
                                    Patvirtink savo el. paštą
                                  </FormLabel>
                                  <Input
                                    type="email"
                                    value={information?.repeatEmail}
                                    onChange={(e) =>
                                      handleFieldChange(
                                        "repeatEmail" as never,
                                        e
                                      )
                                    }
                                  />
                                </FormControl>
                              </Stack>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid
                          justifyContent={"center"}
                          mt={{ base: 10, md: 0 }}
                        >
                          <Stack maxW={"lg"} px={6}>
                            <Stack align={"center"}>
                              <Heading fontSize={"4xl"} textAlign={"center"}  fontFamily={"Roboto"}> 
                                Pristatymo duomenys
                              </Heading>
                            </Stack>
                            <Box
                              rounded={"lg"}
                              boxShadow={"lg"}
                              p={8}
                              height={"325px"}
                              bg={"white"}
                            >
                              <Stack spacing={4}>
                                <HStack>
                                  <Box>
                                    <FormControl id="street" isRequired>
                                      <FormLabel>Gatvė</FormLabel>
                                      <Input
                                        type="text"
                                        value={information?.street}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            "street" as never,
                                            e
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Box>
                                  <Box>
                                    <FormControl id="address" isRequired>
                                      <FormLabel>Adresas</FormLabel>
                                      <Input
                                        type="text"
                                        value={information?.address}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            "address" as never,
                                            e
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Box>
                                </HStack>
                                <HStack>
                                  <FormControl id="zipcode" isRequired>
                                    <FormLabel>Pašto kodas</FormLabel>
                                    <Input
                                      type="text"
                                      value={information?.zipCode}
                                      onChange={(e) =>
                                        handleFieldChange("zipCode" as never, e)
                                      }
                                    />
                                  </FormControl>
                                  <FormControl id="city" isRequired>
                                    <FormLabel>Miestas</FormLabel>
                                    <Input
                                      type="text"
                                      value={information?.city}
                                      onChange={(e) =>
                                        handleFieldChange("city" as never, e)
                                      }
                                    />
                                  </FormControl>
                                </HStack>
                                <Select
                                  isRequired
                                  variant={"flushed"}
                                  value={information?.region}
                                  onChange={(e) =>
                                    handleFieldChange("region" as never, e)
                                  }
                                >
                                  <option disabled selected>
                                    Pasirinkite rajoną
                                  </option>
                                  <option value="Alytus">Alytus</option>
                                  <option value="Kaunas">Kaunas</option>
                                  <option value="Klaipėda">Klaipėda</option>
                                  <option value="Marijampolė">
                                    Marijampolė
                                  </option>
                                  <option value="Tauragė">Tauragė</option>
                                  <option value="Telšiai">Telšiai</option>
                                  <option value="Utena">Utena</option>
                                  <option value="Vilnius">Vilnius</option>
                                  <option value="Šiauliai">Šiauliai</option>
                                </Select>
                              </Stack>
                            </Box>
                          </Stack>
                        </Grid>
                      </Flex>
                      <Flex justify={"flex-end"}>
                        <Button
                          type="submit"
                          justifyContent={"end"}
                          mr={5}
                          bg={"black"}
                          color={"white"}
                          _hover={{
                            bg: "gray",
                          }}
                        >
                          Apmokėti
                        </Button>
                      </Flex>
                    </form>
                  </>
                )}
              </Step>
            ))}
          </Steps>
          <Flex width="100%" justify="flex-end" mt={4} mb={{ base: 5, md: 0 }}>
            {activeStep !== 0 ? (
              <Button
                justifyContent={"center"}
                mr={5}
                onClick={prevStep}
                bg={"red.500"}
                color={"white"}
                _hover={{
                  bg: "red.700",
                }}
                width={100}
              >
                Atgal
              </Button>
            ) : (
              <Button
                justifyContent={"end"}
                onClick={nextStep}
                mr={10}
                bg={"black"}
                color={"white"}
                _hover={{
                  bg: "gray",
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
