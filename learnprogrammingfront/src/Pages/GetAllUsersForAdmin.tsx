import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Box,
  Heading,
  Spinner,
  Flex,
  Input,
  Avatar,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { UserTypes } from "../Types/UserTypes";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import toast from "react-hot-toast";

const GetAllUsersForAdmin = () => {
  const token = localStorage.getItem("accessToken");
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUsers = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/getUsers`, {
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

  useEffect(() => {
    getUsers();
  }, [isLoading]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Flex mb={8} justify="center">
        <Heading size="lg" fontFamily={"Roboto"}>Vartotojų sąrašas</Heading>
      </Flex>
      <Flex justify={"center"} width={"25%"} margin={"auto"}>
        <InputGroup mb={4}>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={SearchIcon} color="black" />}
          />
          <Input
            type="text"
            placeholder="Ieškokite pagal vardą ir pavardę"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </InputGroup>
      </Flex>
      <Box overflowX="auto" maxWidth="100%">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Nuotrauka</Th>
            <Th>Asmuo</Th>
            <Th>El.Paštas</Th>
            <Th>Miestas</Th>
            <Th>Mokykla</Th>
            <Th>Statusas</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user, index) => (
            <Tr key={index}>
              <Td>
                <Avatar src={"data:image/jpeg;base64," + user.avatar} />
              </Td>
              <Td>
                <Text>
                  {user.name} {user.surname}
                </Text>
              </Td>
              <Td>
                <Text>{user.email}</Text>
              </Td>
              <Td>
                <Text>{user.city}</Text>
              </Td>
              <Td>
                <Text>{user.school}</Text>
              </Td>
              <Td>
                <Text>{user.status}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </Box>
    </Box>
  );
};

export { GetAllUsersForAdmin };
