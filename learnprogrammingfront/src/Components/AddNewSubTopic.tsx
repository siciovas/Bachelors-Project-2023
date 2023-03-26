import React, { ChangeEvent, FormEvent, useState } from "react";
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

interface Props {
  AddLearningSubTopic: (
    e: FormEvent<HTMLFormElement>,
    subTopicName: string
  ) => void;
}

const AddNewSubTopic = ({ AddLearningSubTopic }: Props) => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);
  const [subTopicName, setSubTopicName] = useState<string>("");

  const onSubTopicNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSubTopicName(e.target.value as string);
  };

  return (
    <>
      <Flex justifyContent={"center"}>
        <Heading
          size={"sm"}
          background={"none"}
          fontWeight={"none"}
          mt={5}
          cursor={"pointer"}
          color={"black"}
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
            backgroundColor: "black",
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
          <form onSubmit={(e) => AddLearningSubTopic(e, subTopicName)}>
            <ModalHeader>Naujos potemės pridėjimas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Pavadinimas</FormLabel>
                <Input
                  type={"text"}
                  onChange={(e) => onSubTopicNameChange(e)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                bg={"green.500"}
                color={"white"}
                borderRadius={"50px 50px 50px 50px"}
                _hover={{
                  bg: "green",
                }}
              >
                Pateikti
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export { AddNewSubTopic };
