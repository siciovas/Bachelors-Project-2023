import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import { Difficulty } from "../Types/LearningTopicsTypes";
import { GetTopicDifficulty } from "../Helpers/GetTopicDifficulty";
import { EditIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";

interface Props {
  EditLearningTopic: (
    e: FormEvent<HTMLFormElement>,
    title: string,
    difficultyInText: Difficulty,
    learningTopicId: number
  ) => void;
  TopicId: number;
}

const EditChosenLearningTopic = ({ EditLearningTopic, TopicId }: Props) => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);
  const [title, setTitle] = useState<string>("");
  const [difficultyInText, setDifficultyInText] = useState<Difficulty>();
  const token = localStorage.getItem("accessToken");

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value as string);
  };
  const onDifficultyChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setDifficultyInText(e.target.value as unknown as Difficulty);
  };

  const openModal = async () => {
    await getLearningTopic()
    onOpen();
  }

  const getLearningTopic = async () => {
    const response = await fetch(`https://localhost:7266/api/learningtopic/${TopicId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
   if (response.status === 200) {
      const topic = await response.json();
      setTitle(topic.title);
      setDifficultyInText(topic.difficultyInText);
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
              EditLearningTopic(e, title, difficultyInText as Difficulty, TopicId)
            }
          >
            <ModalHeader>Temos redagavimas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Pavadinimas</FormLabel>
                <Input type={"text"} onChange={(e) => onTitleChange(e)} value={title}></Input>
              </FormControl>
              <Select
                isRequired
                variant={"flushed"}
                mt={4}
                onChange={(e) => onDifficultyChange(e)}
                value={difficultyInText}
              >
                <option disabled selected>
                  Pasirinkite lygį
                </option>
                <option value={Difficulty.Easy}>
                  {GetTopicDifficulty(Difficulty.Easy)}
                </option>
                <option value={Difficulty.Normal}>
                  {GetTopicDifficulty(Difficulty.Normal)}
                </option>
                <option value={Difficulty.Hard}>
                  {GetTopicDifficulty(Difficulty.Hard)}
                </option>
              </Select>
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

export { EditChosenLearningTopic };
