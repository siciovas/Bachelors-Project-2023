import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>();
  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [city, setCity] = useState<string>();
  const [school, setSchool] = useState<string>();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value as string);
  };
  const onNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value as string);
  };
  const onSurnameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSurname(e.target.value as string);
  };
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value as string);
  };
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value as string);
  };
  const onCityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCity(e.target.value as string);
  };
  const onSchoolChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSchool(e.target.value as string);
  };

  const Registration = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        name,
        surname,
        email,
        password,
        city,
        school,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      toast({
        title: "Registracija sėkminga",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      navigate("/prisijungimas");
    } else {
      toast({
        title: data.message,
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <Flex>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Registruokis
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            ir įgyk programavimo patirties! ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <form onSubmit={(e) => Registration(e)}>
              <FormControl id="userName" isRequired>
                <FormLabel>Slapyvardis</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => {
                    onUsernameChange(e);
                  }}
                />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>Vardas</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => {
                        onNameChange(e);
                      }}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Pavardė</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => {
                        onSurnameChange(e);
                      }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>El. Paštas</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => {
                    onEmailChange(e);
                  }}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Slaptažodis</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      onPasswordChange(e);
                    }}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        Papildoma informacija
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <FormControl id="city">
                      <FormLabel>Miestas</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          onCityChange(e);
                        }}
                      />
                    </FormControl>
                    <FormControl id="school">
                      <FormLabel>Mokykla</FormLabel>
                      <Input
                        type="text"
                        onChange={(e) => {
                          onSchoolChange(e);
                        }}
                      />
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  type="submit"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Registruotis
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Turi paskyrą?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => navigate("/prisijungimas")}
                  >
                    Prisijunk!
                  </Link>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export { RegisterPage };
