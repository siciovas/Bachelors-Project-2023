import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Avatar,
  Center,
  Box,
  Spinner,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openModal = () => {
    onOpen();
  };

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
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const user = await response.json();
      setAvatar(user.avatar);
      setName(user.name);
      setSurname(user.surname);
      setUsername(user.userName);
      setEmail(user.email);
      setCity(user.city);
      setSchool(user.school);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  useEffect(() => {
    getUserInformation();
  }, [isLoading]);

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
    if (response.status === 401) {
      eventBus.dispatch("logOut", "");
    }
    if (response.status === 200) {
      setIsLoading(true);
      toast.success("Atnaujinta!");
    } else {
      toast.error("Atnaujinti nepavyko!");
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
    if (response.status === 401) {
      eventBus.dispatch("logOut", "");
    }
    if (response.status === 200) {
      setIsLoading(true);
      toast.success("Slaptažodis pakeistas!");
    } else {
      toast.error("Atnaujinti nepavyko!");
    }
  };

  const deleteProfile = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(`https://localhost:7266/api/deleteProfile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });

    if (response.status === 204) {
      setIsLoading(true);
      toast.success("Paskyra ištrinta!");
      onClose();
      localStorage.removeItem("accessToken");
      navigate("/");
    } else {
      toast.error("Nepavyko ištrinti!");
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
      <Box width={"100%"}>
        <Flex minH={"100vh"} align={"center"} justify={"center"}>
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
            background={"white"}
          >
            <Heading
              lineHeight={1.1}
              textAlign={"center"}
              fontSize={{ base: "2xl", sm: "3xl" }}
              fontFamily={"Roboto"}
            >
              {`${name} ${surname}`}
            </Heading>
            <form onSubmit={(e) => UpdateUserProfile(e)}>
              <FormControl id="userName">
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar
                      size="2xl"
                      src={"data:image/jpeg;base64," + avatar}
                    />
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
                  bg={"black"}
                  color={"white"}
                  _hover={{
                    bg: "green",
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
                    bg={"black"}
                    color={"white"}
                    _hover={{
                      bg: "gray",
                    }}
                  >
                    Keisti slaptažodį
                  </Button>
                </Stack>
              </Stack>
            </form>
            <Button
              onClick={openModal}
              background="red.500"
              color={"white"}
              _hover={{
                bg: "red.700",
              }}
            >
              Ištrinti paskyrą
            </Button>
          </Stack>
        </Flex>
      </Box>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Perspėjimas!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Ar tikrai norite ištrinti savo paskyrą?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                background="red.500"
                mr={3}
                borderRadius={"50px 50px 50px 50px"}
                onClick={(e) => deleteProfile(e)}
                color={"white"}
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

export { Profile };
