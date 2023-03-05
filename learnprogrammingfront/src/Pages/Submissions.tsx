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
  useToast,
  Textarea,
} from "@chakra-ui/react";

const Submissions = () => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);
  const toast = useToast();
  const token = localStorage.getItem("accessToken");
  const [topic, setTopic] = useState<string>();
  const [message, setMessage] = useState<string>();

  const onTopicChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTopic(e.target.value as string);
  };
  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value as string);
  };


  const SendSubmission = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/submission", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
       topic,
       message,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      toast({
        title: "Pranešimas išsiųstas",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: data.message,
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button
        background={"none"}
        fontWeight={"none"}
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
      >
        Prašymas
      </Button>
      <Modal
        isCentered
        isOpen={isOpen}
        initialFocusRef={initialRef}
        onClose={onClose}
      >
        {overlay}
        <ModalContent>
          <form onSubmit={(e) => SendSubmission(e)}>
          <ModalHeader>Prašymas</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Pavadinimas</FormLabel>
              <Input type={"text"} onChange={(e) => onTopicChange(e)}></Input>
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Žinutė</FormLabel>
              <Textarea onChange={(e) => onMessageChange(e)}></Textarea>
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
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export { Submissions };
