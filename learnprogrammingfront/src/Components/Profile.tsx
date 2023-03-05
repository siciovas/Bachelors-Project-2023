import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
  Box,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  useNavigate();
  const token = localStorage.getItem("accessToken");
  const toast = useToast();

  const [avatar, setAvatar] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [city, setCity] = useState<string>();
  const [school, setSchool] = useState<string>();
  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value as string);
  };
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value as string);
  };
  const onCityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCity(e.target.value as string);
  };
  const onSchoolChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSchool(e.target.value as string);
  };

  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [repeatPassword, setRepeatPassword] = useState<string>();

  const onOldPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setOldPassword(e.target.value as string);
  };
  const onNewPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(e.target.value as string);
  };
  const onRepeatPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRepeatPassword(e.target.value as string);
  };

  const onAvatarChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files) {
      const file = e.target.files[0];
      const test = new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            resolve(event.target.result);
          }
        };

        reader.onerror = (err) => {
          reject(err);
        };

        reader.readAsDataURL(file);
      });
      const temp = (await test) as string;
      setAvatar(temp.split(",")[1]);
    }
  };

  const getUserInformation = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    const user = await response.json();
    setAvatar(user.avatar);
    setName(user.name);
    setSurname(user.surname);
    setUsername(user.userName);
    setEmail(user.email);
    setCity(user.city);
    setSchool(user.school);
  }, []);

  useEffect(() => {
    getUserInformation();
  }, []);

  const UpdateUserProfile = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/updateProfile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: JSON.stringify({
        avatar,
        username,
        email,
        city,
        school,
      }),
    });

    if (response.status === 200) {
      toast({
        title: "Atnaujinta",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      window.location.reload();
    } else {
      toast({
        title: "Atnaujinti nepavyko",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const UpdatePassword = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/updatePassword", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
      body: JSON.stringify({
        oldPassword,
        newPassword,
        repeatPassword,
      }),
    });

    if (response.status === 200) {
      toast({
        title: "Slaptažodis pakeistas",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      window.location.reload();
    } else {
      toast({
        title: "Atnaujinti nepavyko",
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
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} textAlign={"center"} fontSize={{ base: "2xl", sm: "3xl" }}>
          {`${name} ${surname}`}
        </Heading>
        <form onSubmit={(e) => UpdateUserProfile(e)}>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="2xl"
                  src={"data:image/jpeg;base64," + avatar}
                ></Avatar>
              </Center>    
              <Center w="full">
                <Box mb={3}>
                  <label className="form-label">Nuotraukos keitimas</label>
                  <input
                    onChange={(e) => {
                      onAvatarChange(e);
                    }}
                    className="form-control"
                    type="file"
                    id="formFile"
                  />
                </Box>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName">
            <FormLabel>Slapyvardis</FormLabel>
            <Input
              onChange={(e) => {
                onUsernameChange(e);
              }}
              placeholder={username}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>El. Paštas</FormLabel>
            <Input
              onChange={(e) => {
                onEmailChange(e);
              }}
              placeholder={email}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl id="city">
            <FormLabel>Miestas</FormLabel>
            <Input
              onChange={(e) => {
                onCityChange(e);
              }}
              placeholder={city}
              type="text"
            />
          </FormControl>
          <FormControl id="school">
            <FormLabel>Mokykla</FormLabel>
            <Input
              onChange={(e) => {
                onSchoolChange(e);
              }}
              placeholder={school}
              type="text"
            />
          </FormControl>
          <Stack spacing={10} pt={5}>
            <Button
              type="submit"
              size="lg"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Atnaujinti profilį
            </Button>
          </Stack>
        </form>
        <form onSubmit={(e) => UpdatePassword(e)}>
          <Stack>
            <FormControl id="password">
              <FormLabel>Senas slaptažodis</FormLabel>
              <Input
                placeholder="Slaptažodis"
                _placeholder={{ color: "gray.500" }}
                type="password"
                onChange={(e) => {
                  onOldPasswordChange(e);
                }}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Naujas slaptažodis</FormLabel>
              <Input
                placeholder="Slaptažodis"
                _placeholder={{ color: "gray.500" }}
                type="password"
                onChange={(e) => {
                  onNewPasswordChange(e);
                }}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Pakartoti slaptažodį</FormLabel>
              <Input
                placeholder="Slaptažodis"
                _placeholder={{ color: "gray.500" }}
                type="password"
                onChange={(e) => {
                  onRepeatPasswordChange(e);
                }}
              />
            </FormControl>
            <Stack spacing={10} pt={5}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Keisti slaptažodį
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
};

export { Profile };
