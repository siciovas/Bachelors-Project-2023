import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  Link,
  useColorMode,
  useDisclosure,
  useColorModeValue,
  Avatar,
  Stack,
  Box,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface LinksProps {
  title: string;
  url: string;
}

const LinksTeachers: LinksProps[] = [
  { title: "Mano kursai", url: "/kursai" },
  { title: "Prašymai", url: "/prasymai" },
  { title: "El. Parduotuvė", url: "/parduotuve" },
];

const NavLink = ({ title, url }: LinksProps): ReactElement<LinksProps> => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={url}
  >
    {title}
  </Link>
);

const TeacherNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const Logout = (e: any): void => {
    e.preventDefault();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  const [avatar, setAvatar] = useState<string>();

  const getUserAvatar = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/getAvatar`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    const avatar = await response.json();
    setAvatar("data:image/jpeg;base64," + avatar.avatar);
  }, []);

  useEffect(() => {
    getUserAvatar();
  }, []);

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Button
          background={"none"}
          fontWeight={"normal"}
          onClick={() => navigate("/")}
        >
          Pagrindinis
        </Button>
        <Flex display={{ base: "none", md: "flex" }}>
          {LinksTeachers.map((link) => (
            <Button
              background={"none"}
              fontWeight={"normal"}
              onClick={() => navigate(link.url)}
            >
              {link.title}
            </Button>
          ))}
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <Box> Naudojatės mokytojo prieiga</Box>
          <Button background={"none"} onClick={() => navigate("/krepselis")}>
            <i className="bi bi-cart-fill"></i>
          </Button>
          <Menu>
            <Button onClick={toggleColorMode} background={"none"}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"sm"} src={avatar} />
            </MenuButton>
            <MenuList>
              <MenuItem>Paskyra</MenuItem>
              <MenuDivider />
              <MenuItem>Įverčiai</MenuItem>
              <MenuDivider />
              <MenuItem>Mano prašymai</MenuItem>
              <MenuItem>Užsakymų istorija</MenuItem>
              <MenuDivider />
              <MenuItem onClick={(e) => Logout(e)}>Atsijungti</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {LinksTeachers.map((link) => (
              <NavLink title={link.title} url={link.url} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export { TeacherNavbar };
