import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const toast = useToast();

  const onUsernameOrEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsernameOrEmail(e.target.value as string);
  };
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value as string);
  };

  const Login = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        usernameOrEmail,
        password,
      }),
    });

    if (response.status === 200) {
      toast({
        title: "Prisijungta",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.role);
      navigate("/");
    } else {
      toast({
        title: "Prisijungimas nepavyko",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Prisijunk prie paskyros</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            ir nerk į programavimo pasaulį ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <form onSubmit={(e) => Login(e)}>
              <FormControl id="usernameOrEmail">
                <FormLabel>Slapyvardis arba el. paštas</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => {
                    onUsernameOrEmailChange(e);
                  }}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => {
                    onPasswordChange(e);
                  }}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link
                    color={"blue.400"}
                    onClick={() => navigate("/atkurimas")}
                  >
                    Pamiršai slaptažodį?
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Neturi paskyros?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => navigate("/registracija")}
                  >
                    Užsiregistruok!
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

export { LoginPage };
