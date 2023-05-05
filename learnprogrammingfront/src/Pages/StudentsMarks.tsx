import {
  Flex,
  Heading,
  Spinner,
  Text,
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import { GradesTypes } from "../Types/GradesTypes";
import toast from "react-hot-toast";

const StudentsMarks = () => {
  const token = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);
  const [grades, setGrades] = useState<GradesTypes[]>([]);

  const getGrades = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/grades`, {
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
        <Heading mt={5} size="lg"  fontFamily={"Roboto"}>
          Mano įverčiai
        </Heading>
      </Flex>
      <Box overflowX="auto" maxWidth="100%" mt={5}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Tema</Th>
              <Th>Potemė</Th>
              <Th>Uždavinys</Th>
              <Th>Pažymys (%)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {grades.map((grade) => (
              <Tr>
                <Td>
                  <Text>{grade.topic}</Text>
                </Td>
                <Td>
                  <Text>{grade.subTopic}</Text>
                </Td>
                <Td>
                  <Text>{grade.task}</Text>
                </Td>
                <Td>
                  <Text>{grade.grade}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export { StudentsMarks };
