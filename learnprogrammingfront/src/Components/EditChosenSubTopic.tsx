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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";

interface Props {
  EditSubTopic: (
    e: FormEvent<HTMLFormElement>,
    title: string,
    id: number
  ) => void;
    TopicId: number;
    SubTopicId: number;
}

const EditChosenSubTopic = ({ EditSubTopic, TopicId, SubTopicId }: Props) => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);
  const [subTopicName, setSubTopicName] = useState<string>("");
  const token = localStorage.getItem("accessToken");

  const onSetSubTopicNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSubTopicName(e.target.value as string);
  };

  const openModal = async () => {
    await getSubTopic()
    onOpen();
  }

  const getSubTopic = async () => {
    const response = await fetch(`https://localhost:7266/api/learningtopic/${TopicId}/subtopic/${SubTopicId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
   if (response.status === 200) {
      const subtopic = await response.json();
      setSubTopicName(subtopic.subTopicName);
    } else {
      toast.error("Netikėta klaida!");
    }
  };

  return (
    <>
      <EditIcon
        cursor="pointer"
        mr={5}
        onClick={async () => {
          setOverlay(<OverlayOne />);
          openModal();
        }}
      />
      <Modal isOpen={isOpen} initialFocusRef={initialRef} onClose={onClose}>
        {overlay}
        <ModalContent>
          <form
            onSubmit={(e) =>
                EditSubTopic(e, subTopicName, SubTopicId)
            }
          >
            <ModalHeader>Temos redagavimas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Pavadinimas</FormLabel>
                <Input type={"text"} onChange={(e) => onSetSubTopicNameChange(e)} value={subTopicName}></Input>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                bg={"black"}
                color={"white"}
                _hover={{
                  bg: "gray",
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

export { EditChosenSubTopic };
