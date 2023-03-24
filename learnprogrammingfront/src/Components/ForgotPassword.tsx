import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  return (
    <Flex justify={"center"} mt={10}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Pamiršai slaptažodį?
        </Heading>
        <Text fontSize={{ base: "sm", sm: "md" }}>
          Suvesk ir patikrink savo pašto dėžutę!
        </Text>
        <FormControl id="email">
          <Input
            placeholder="tavo@pastas.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            borderRadius={"50px 50px 50px 50px"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};
export { ForgotPassword };
