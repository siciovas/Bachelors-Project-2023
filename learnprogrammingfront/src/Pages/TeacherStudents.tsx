import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
  Box,
  Spinner,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Unauthorized } from "../Constants/Auth";
import eventBus from "../Helpers/EventBus";
import { UserTypes } from "../Types/UserTypes";

const TeacherStudents = () => {
  const token = localStorage.getItem("accessToken");
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletingId, setDeletingId] = useState<string>();

  const openModal = (id: string) => {
    setDeletingId(id);
    onOpen();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  useEffect(() => {
    getUsers();
  }, [isLoading]);

  const deleteStudent = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    studentId: string
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(
      `https://localhost:7266/api/deleteStudent/${studentId}`,
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
      toast.success("Studentas pašalintas!");
      onClose();
    } else {
      toast.error("Nepavyko pašalinti!");
    }
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
      <Box p={4}>
        <Flex mb={8} justify="center">
          <Heading size="lg" fontFamily={"Roboto"}>Mano mokinių sąrašas</Heading>
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
      </Box>
      <>
        <Box overflowX="auto" maxWidth="100%">
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Nuotrauka</Th>
                <Th>Asmuo</Th>
                <Th>El.Paštas</Th>
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
                    <Button
                      background="red.500"
                      onClick={() => openModal(user.id)}
                      color={"white"}
                      _hover={{
                        bg: "red.700",
                      }}
                    >
                      Atsisakyti
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Perspėjimas!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text >Ar tikrai norite pašalinti studentą iš savo sąrašo?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                background="red.500"
                color={"white"}
                mr={3}
                borderRadius={"50px 50px 50px 50px"}
                onClick={(e) => deleteStudent(e, deletingId as string)}
                _hover={{
                  bg: "red.700",
                }}
              >
                Ištrinti
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export { TeacherStudents };
