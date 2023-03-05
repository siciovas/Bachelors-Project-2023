import React from "react";
import {
  Button,
  ModalOverlay,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
} from "@chakra-ui/react";

const AddNewSubTopic = () => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);

  return (
    <>
    <Flex justifyContent={"center"}>
      <Heading
        size={"sm"}
        background={"none"}
        fontWeight={"none"}
        mt={5}
        cursor={"pointer"}
        color={"grey"}
        position="relative"
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
        _hover={{
            _after: {
              transform: "scaleX(1)",
              transformOrigin: "bottom left",
            },
          }}
          _after={{
            content: '" "',
            position: "absolute",
            width: "100%",
            height: "2px",
            bottom: 0,
            left: 0,
            backgroundColor: "grey",
            transform: "scaleX(0)",
            transformOrigin: "bottom right",
            transition: "transform 0.25s ease-out",
          }}
      >
        Sukurti potemę
      </Heading>
      </Flex>
      <Modal
        isCentered
        isOpen={isOpen}
        initialFocusRef={initialRef}
        onClose={onClose}
      >
        {overlay}
        <ModalContent>
          <ModalHeader>Naujos potemės pridėjimas</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Pavadinimas</FormLabel>
              <Input type={"text"} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              bg={"blue.500"}
              color={"black"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Pateikti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { AddNewSubTopic };
