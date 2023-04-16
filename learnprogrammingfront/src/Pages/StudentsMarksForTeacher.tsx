import {
  Flex,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Spinner,
  Text,
  Box,
  Tbody,
  Avatar,
  Table,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import toast from "react-hot-toast";
import { GradesForTeacherTypes, GradesTypes } from "../Types/GradesTypes";
import { SearchIcon } from "@chakra-ui/icons";
import { UserTypes } from "../Types/UserTypes";

const StudentsMarksForTeacher = () => {
  const token = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [grades, setGrades] = useState<GradesForTeacherTypes[]>([]);

  const filteredUsers = grades.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccordionClick = (index: number) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const getGrades = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/grades/gradesForTeacher`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const grades = await response.json();
      setGrades(grades);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  useEffect(() => {
    getGrades();
  },[isLoading])

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
          Mokinių įverčiai
        </Heading>
      </Flex>
      <Flex justify={"center"} width={"25%"} margin={"auto"} mt={4}>
        <InputGroup mb={4}>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={SearchIcon} color="white" />}
          />
          <Input
            type="text"
            placeholder="Ieškokite pagal vardą ir pavardę"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </InputGroup>
      </Flex>
      <Accordion
        allowToggle
        width={"50%"}
        m={"auto"}
        mt={5}
        border={"transparent"}
        mb={7}
      >
        {filteredUsers.map((grade, index) => (
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
            <Box
              as={FaChevronDown}
              mr={3}
              w={4}
              h={4}
              borderRadius="full"
              backgroundColor="gray.400"
            />
           {grade.name} {grade.surname}
          </AccordionButton>
          <AccordionPanel
            background={"white"}
            borderRadius={"50px 50px 50px 50px"}
            display={expandedIndex === index ? "block" : "none"}
          >
            <Box overflowX="auto" maxWidth="100%">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>Kurso tema</Th>
                    <Th>Potemė</Th>
                    <Th>Uždavinys</Th>
                    <Th>Pažymys (%)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {grade.grades.map((gradeinfo) =>(
                  <Tr>
                    <Td>
                      <Text>{gradeinfo.topic}</Text>
                    </Td>
                    <Td>
                      <Text>{gradeinfo.subTopic}</Text>
                    </Td>
                    <Td>
                      <Text>{gradeinfo.task}</Text>
                    </Td>
                    <Td>
                      <Text>{gradeinfo.grade}</Text>
                    </Td>
                  </Tr>
                ))}
                </Tbody>
              </Table>
            </Box>
          </AccordionPanel>
        </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export { StudentsMarksForTeacher };
