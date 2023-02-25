import React from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
} from "@chakra-ui/react";
import { FiHome, FiDollarSign } from "react-icons/fi";
import { Step, Steps, useSteps } from "chakra-ui-steps";

const steps = [
  { label: "1 žingsnis", description: "Krepšelio sąrašas", icon: FiDollarSign },
  { label: "2 žingsnis", description: "Pristatymo informacija", icon: FiHome },
];

const ShoppingCart = () => {
  const { nextStep, prevStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <>
        <Steps activeStep={activeStep} flexDirection="row" className="d-flex">
          {steps.map(({ label, description, icon }, index) => (
            <Step label={label} key={label} description={description} icon={icon}>
              {index === 0 ? (
                <>
                  <Box py={10} px={10} mx={"auto"}>
                    <Grid
                      templateColumns="repeat(5, 1fr)"
                      gap={4}
                      alignItems={"center"}
                      mb={3}
                    >
                      <GridItem colSpan={2}>
                        <Heading size={"lg"}>Tavo krepšelis</Heading>
                      </GridItem>
                      <GridItem textAlign={"center"}>
                        <Heading size={"md"}>Viršelio tipas</Heading>
                      </GridItem>
                      <GridItem textAlign={"center"}>
                        <Heading size={"md"}>Kiekis</Heading>
                      </GridItem>
                      <GridItem textAlign={"center"}>
                        <Heading size={"md"}>Kaina</Heading>
                      </GridItem>
                    </Grid>
                    <Divider />
                    <Grid
                      templateColumns="repeat(5, 1fr)"
                      gap={4}
                      alignItems={"center"}
                      mb={3}
                    >
                      <GridItem colSpan={2}>
                        <Flex alignItems={"center"}>
                          <Box m={"20px 15px 5px 15px"}>
                            <Image
                              src="https://i.imgur.com/2DsA49b.jpg"
                              width={120}
                              borderRadius={5}
                            />
                          </Box>
                          <Heading size={"md"} fontWeight="normal">
                            Thinking, Fast and Slow
                          </Heading>
                        </Flex>
                      </GridItem>
                      <GridItem>
                        <Flex justifyContent={"center"}>Digital</Flex>
                      </GridItem>
                      <GridItem>
                        <Flex justifyContent={"center"}>1</Flex>
                      </GridItem>
                      <GridItem>
                        <Flex justifyContent={"center"}>$9.99</Flex>
                      </GridItem>
                    </Grid>
                    <Divider />
                  </Box>
                  <Flex flexDirection={"column"} pr={10}>
                    <Flex justifyContent={"end"} mb={3}>
                      <Flex flexDirection={"row"} gap={5}>
                        <Flex flexDirection={"column"}>
                          Suma
                          <Heading size={"sm"}>$23.49</Heading>
                        </Flex>
                        <Flex flexDirection={"column"}>
                          Pristatymas
                          <Heading size={"sm"}>$2.99</Heading>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex justifyContent={"end"}>
                      <Flex flexDirection={"column"} mr={7}>
                        Iš viso
                        <Heading size={"sm"}>$26.48</Heading>
                      </Flex>
                    </Flex>
                    <Flex justifyContent={"end"} mt={3}>
                      <Button w={155}>Tęsti</Button>
                    </Flex>
                  </Flex>
                </>
              ) : (
                <>



                </>
              )}
            </Step>
          ))}
        </Steps>
      <Flex width="100%" justify="flex-end" mt={5}>
        <Button
          isDisabled={activeStep === 0}
          mr={4}
          onClick={prevStep}
          size="sm"
          variant="ghost"
        >
          Atgal
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button type="submit" size="sm">
            Apmokėti
          </Button>
        ) : (
          <Button size="sm" onClick={nextStep}>
            Toliau
          </Button>
        )}
      </Flex>
    </>
  );
};
export { ShoppingCart };
