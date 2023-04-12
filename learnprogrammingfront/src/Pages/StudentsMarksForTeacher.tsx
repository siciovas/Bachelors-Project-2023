import {
  Flex,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Spinner,
  Box,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import { UserTypes } from "../Types/UserTypes";
import toast from "react-hot-toast";

const StudentsMarksForTeacher = () => {
  const token = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserTypes[]>([]);

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  // );

  const handleAccordionClick = (index: number) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const getUsers = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/getMyStudents`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const user = await response.json();
      setUsers(user);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  // if (isLoading) {
  //   return (
  //     <Flex justifyContent="center" top="50%" left="50%" position="fixed">
  //       <Spinner size="xl" />
  //     </Flex>
  //   );
  // }

  return (
    <>
      <Flex justifyContent={"center"}>
        <Heading mt={15} size="lg">
          Mokinių įverčiai
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
        {/* {submissions.map((submission, index) => ( */}
        <AccordionItem>
          <AccordionButton
            // onClick={() => handleAccordionClick(index)}
            _focus={{ boxShadow: "none" }}
            _hover={{ backgroundColor: "transparent" }}
            _active={{ backgroundColor: "transparent" }}
            // backgroundColor={expandedIndex === index ? "gray.200" : "white"}
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
            <Box
              as={FaChevronDown}
              mr={3}
              w={4}
              h={4}
              borderRadius="full"
              backgroundColor="gray.400"
            />
            {/* {submission.topic} */}
            Rokas Sičiovas
          </AccordionButton>
          <AccordionPanel
            background={"white"}
            borderRadius={"50px 50px 50px 50px"}
            // display={expandedIndex === index ? "block" : "none"}
          >
            <Box textAlign={"center"}></Box>
          </AccordionPanel>
        </AccordionItem>
        {/* ))} */}
      </Accordion>
    </>
  );
};

export { StudentsMarksForTeacher };
