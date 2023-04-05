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
  Divider,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import { OrderTypes } from "../Types/OrderTypes";
import moment from "moment";

const OrderHistory = () => {
  const token = localStorage.getItem("accessToken");
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };
  const getOrdersHistory = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/order/getByUserId`,
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
      const order = await response.json();
      setOrders(order);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  useEffect(() => {
    getOrdersHistory();
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
      <Flex justifyContent={"center"}>
        <Heading mt={15} size="lg">
          Mano užsakymų istorija
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
        {orders.map((order, index) => (
          <AccordionItem>
            <AccordionButton
              onClick={() => handleAccordionClick(index)}
              _focus={{ boxShadow: "none" }}
              _hover={{ backgroundColor: "transparent" }}
              _active={{ backgroundColor: "transparent" }}
              backgroundColor={expandedIndex === index ? "gray.200" : "white"}
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
                {order.orderNumber} | {order.total}€ |{" "}
                {moment(order.orderTime).format("yyyy-MM-DD HH:mm:ss")}
              </>
            </AccordionButton>
            <AccordionPanel
              background={"white"}
              borderRadius={"50px 50px 50px 50px"}
              display={expandedIndex === index ? "block" : "none"}
            >
              <Flex
                textAlign={"center"}
                flexDir={"column"}
                justify={"center"}
                align={"center"}
              >
                {order.orderItems.map((orderItem) => (
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
        ))}
      </Accordion>
    </>
  );
};

export { OrderHistory };
