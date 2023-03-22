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
  useDisclosure,
  Avatar,
  Stack,
  Box,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Submissions } from "../../Pages/Submissions";
import eventBus from "../../Helpers/EventBus";

interface LinksProps {
  title: string;
  url: string;
}

const LinksTeachers: LinksProps[] = [
  { title: "Mano kursai", url: "/kursai" },
  { title: "El. Parduotuvė", url: "/parduotuve" },
];

const NavLink = ({ title, url }: LinksProps): ReactElement<LinksProps> => (
  <Link px={2} py={1} rounded={"md"} href={url}>
    {title}
  </Link>
);

const TeacherNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  const Logout = (e: any): void => {
    e.preventDefault();
    eventBus.dispatch("logOut", "");
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
    <Box
      px={4}
      width={"100%"}
      backgroundColor={location.pathname === "/" ? "none" : "#98aad0"}
      zIndex={1}
      position={location.pathname === "/" ? "absolute" : "relative"}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Button
          color={"white"}
          background={"none"}
          fontWeight={"normal"}
          onClick={() => navigate("/")}
          cursor={"pointer"}
          zIndex={1}
          _hover={{
            bg: "none",
          }}
        >
          Pagrindinis
        </Button>
        <Flex
          display={{ base: "none", md: "flex" }}
          width={"100%"}
          justifyContent={"center"}
          position={"absolute"}
        >
          {LinksTeachers.map((link) => (
            <Button
              background={"none"}
              fontWeight={"normal"}
              onClick={() => navigate(link.url)}
              color={"white"}
              _hover={{
                bg: "none",
              }}
            >
              {link.title}
            </Button>
          ))}
          <Submissions />
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <Box color={"white"}> Naudojatės mokytojo prieiga</Box>
          <Button
            background={"none"}
            onClick={() => navigate("/krepselis")}
            color={"white"}
            _hover={{
              bg: "none",
            }}
          >
            <i className="bi bi-cart-fill"></i>
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"md"} src={avatar} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/paskyra")}>Paskyra</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => navigate("/studentuivertinimai")}>Studentų įverčiai</MenuItem>
              <MenuItem onClick={() => navigate("/studentusarasas")}>Priskirti studentą</MenuItem>
              <MenuDivider />
              <MenuItem onClick={(e) => navigate("/manoprasymai")}>Mano prašymai</MenuItem>
              <MenuItem onClick={(e) => navigate("/manouzsakymai")}>Užsakymų istorija</MenuItem>
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
