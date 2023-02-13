import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  Input,
  Stack,
  Button,
  useColorModeValue,
  HStack,
  FormLabel,
  Center,
  Flex,
} from "@chakra-ui/react";

const Submissions = () => {
  return (
    <Flex alignItems={"center"} gap={5}>
      <Accordion defaultIndex={[0]} alignContent={"center"} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton width={600}>
              <Box as="div" flex="1" textAlign="center">
                Prašymas tapti mokytoju
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Box
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              <Stack spacing={4} height={400} width={300} alignItems={"center"}>
                <HStack>
                  <Box alignContent={"center"}>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>Vardas</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName">
                      <FormLabel>Pavardė</FormLabel>
                      <Input type="text" />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>El. paštas</FormLabel>
                  <Input type="email" />
                </FormControl>
                <FormControl id="city">
                  <FormLabel>Miestas</FormLabel>
                  <Input type="text" />
                </FormControl>
                <FormControl id="school">
                  <FormLabel>Mokykla</FormLabel>
                  <Input type="text" />
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Pateikti prašymą
                  </Button>
                </Stack>
                <Stack pt={6}></Stack>
              </Stack>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export { Submissions };
