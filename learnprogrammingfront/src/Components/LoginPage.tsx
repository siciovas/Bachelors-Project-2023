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
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

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
      toast.success("Prisijungta!");
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.role);
      navigate("/");
    } else {
      toast.error("Prisijungimas nepavyko!");
    }
  };

  return (
    <Flex mt={10}>
      <Stack spacing={8} mx={"auto"}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Prisijunk prie paskyros</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            ir nerk į programavimo pasaulį ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} boxShadow={"lg"} p={8} background={"white"}>
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
              <Stack mt={5}>
                <Button
                  type="submit"
                  bg={"green.500"}
                  color={"white"}
                  borderRadius={"50px 50px 50px 50px"}
                  _hover={{
                    bg: "green",
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
