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
  Select,
  Box,
} from "@chakra-ui/react";
import { Difficulty } from "../Types/LearningTopicsTypes";
import { GetTopicDifficulty } from "../Helpers/GetTopicDifficulty";

interface Props {
  AddLearningTopic: (
    e: FormEvent<HTMLFormElement>,
    title: string,
    difficultyInText: Difficulty
  ) => void;
}

const AddNewLearningTopic = ({ AddLearningTopic }: Props) => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);
  const [title, setTitle] = useState<string>("");
  const [difficultyInText, setDifficultyInText] = useState<Difficulty>();

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value as string);
  };
  const onDifficultyChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setDifficultyInText(e.target.value as unknown as Difficulty);
  };

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Button
          cursor={"pointer"}
          width="100%"
          height="100%"
          fontSize={"200%"}
          color={"grey"}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={"black"}
          onClick={() => {
            setOverlay(<OverlayOne />);
            onOpen();
          }}
        >
          Pridėti naują temą
        </Button>
      </Box>
      <Modal isOpen={isOpen} initialFocusRef={initialRef} onClose={onClose}>
        {overlay}
        <ModalContent>
          <form
            onSubmit={(e) =>
              AddLearningTopic(e, title, difficultyInText as Difficulty)
            }
          >
            <ModalHeader>Naujos temos pridėjimas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Pavadinimas</FormLabel>
                <Input type={"text"} onChange={(e) => onTitleChange(e)}></Input>
              </FormControl>
              <Select
                isRequired
                variant={"flushed"}
                mt={4}
                onChange={(e) => onDifficultyChange(e)}
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

export { AddNewLearningTopic };
