import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Spinner,
  Heading,
  Image,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import { OrderTypes } from "../Types/OrderTypes";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

const PayseraSuccessfully = () => {
  const token = localStorage.getItem("accessToken");
  const [orders, setOrders] = useState<OrderTypes>();
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const getOrderedOrder = useCallback(async () => {
    console.log(searchParams.get("ordernumber"));
    const response = await fetch(
      `https://localhost:7266/api/order/${searchParams.get("ordernumber")}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      }
    );
    if (response.status === 200) {
      const order = await response.json();
      console.log(order);
      setOrders(order);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  useEffect(() => {
    getOrderedOrder();
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
      <Flex justify={"center"} align={"center"} mt={10}>
        <Heading size={"md"}>Užsakymas patvirtintas!</Heading>
      </Flex>
      <Box className="wrapper">
        {" "}
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          {" "}
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />{" "}
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </Box>
      <Flex justifyContent={"center"}>
        <Heading mt={15} size="md">
          Užsakymas
        </Heading>
      </Flex>
      <Accordion
        allowToggle
        width={"50%"}
        m={"auto"}
        mt={5}
        border={"transparent"}
        mb={7}
      >
        <AccordionItem>
          <AccordionButton
            onClick={() => setExpandedIndex(0)}
            _focus={{ boxShadow: "none" }}
            _hover={{ backgroundColor: "transparent" }}
            _active={{ backgroundColor: "transparent" }}
            backgroundColor={expandedIndex === 0 ? "gray.200" : "white"}
            borderRadius="full"
            border="1px"
            borderColor="gray.400"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            px={4}
            py={2}
            transition="background-color 0.2s ease-out"
            _expanded={{ backgroundColor: "gray.200" }}
            _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
            mt={2}
          >
            <>
              <Box
                as={FaChevronDown}
                mr={3}
                w={4}
                h={4}
                borderRadius="full"
                backgroundColor="gray.400"
              />
              {orders?.orderNumber} | {orders?.total}€ |{" "}
              {moment(orders?.orderTime).format("yyyy-MM-DD HH:mm:ss")}
            </>
          </AccordionButton>
          <AccordionPanel
            background={"white"}
            borderRadius={"50px 50px 50px 50px"}
            display={expandedIndex === 0 ? "block" : "none"}
          >
            <Flex
              textAlign={"center"}
              flexDir={"column"}
              justify={"center"}
              align={"center"}
            >
              {orders?.orderItems.map((orderItem) => (
                <Box>
                  <Image
                    src={"data:image/jpeg;base64," + orderItem.photo}
                    width={120}
                    borderRadius={50}
                  />
                  {orderItem.name} {orderItem.price}€
                </Box>
              ))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export { PayseraSuccessfully };
