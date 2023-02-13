import { ReactElement } from "react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Link,
  IconButton,
  Button,
  Menu,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";

interface LinksProps {
  title: string;
  url: string;
}

const LinksGuest: LinksProps[] = [
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

const GuestNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <SimpleGrid
        className="navbar-container"
        columns={3}
        h={14}
        alignItems="center"
      >
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <Flex>
          <Button
            justifyContent="flex-start"
            background={"none"}
            fontWeight={"normal"}
            onClick={() => navigate("/")}
          >
            Pagrindinis
          </Button>
        </Flex>
        <Flex justifyContent="center" display={{ base: "none", md: "flex" }}>
          {LinksGuest.map((link) => (
            <Button
              background={"none"}
              fontWeight={"normal"}
              onClick={() => navigate(link.url)}
            >
              {link.title}
            </Button>
          ))}
        </Flex>
        <Flex justifyContent="flex-end" alignItems={"center"} gap={2}>
          <Menu>
            <Box>Naudojatės svečio prieiga</Box>
            <Button onClick={toggleColorMode} background={"none"}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Button
              background={"none"}
              fontWeight={"normal"}
              onClick={() => navigate("/prisijungimas")}
            >
              Prisijungti
            </Button>
          </Menu>
        </Flex>
      </SimpleGrid>
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {LinksGuest.map((link) => (
              <NavLink title={link.title} url={link.url} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export { GuestNavbar };
