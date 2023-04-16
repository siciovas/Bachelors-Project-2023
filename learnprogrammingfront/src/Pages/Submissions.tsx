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
import { convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import toast from "react-hot-toast";
import { isMobile } from "react-device-detect";

const Submissions = () => {
  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
  const initialRef = React.useRef(null);
  const token = localStorage.getItem("accessToken");
  const [topic, setTopic] = useState<string>();

  const onTopicChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTopic(e.target.value as string);
  };
  const [message, setMessage] = React.useState<EditorState>(
    EditorState.createEmpty()
  );

  const SendSubmission = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const messageLength = convertToRaw(
      message.getCurrentContent()
    ).blocks[0].text.trim().length;
    if (messageLength > 0) {
      const response = await fetch("https://localhost:7266/api/submission", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          topic,
          message: draftToHtml(
            convertToRaw(message.getCurrentContent())
          ).replace(/\s+$/, ""),
        }),
      });
      if (response.status === 201) {
        toast.success("Pranešimas išsiųstas!");
        onClose();
      } else {
        toast.error("Nepavyko!");
      }
    } else {
      toast.error("Tuščios žinutės išsiųsti neįmanoma!");
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
        color="white"
        _hover={{
          bg: "none",
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
        <ModalContent maxW={"50%"}>
          <form onSubmit={(e) => SendSubmission(e)}>
            <ModalHeader>Prašymas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired>
                <FormLabel>Pavadinimas</FormLabel>
                <Input type={"text"} onChange={(e) => onTopicChange(e)}></Input>
              </FormControl>
              <FormControl mt={4} isRequired>
                <>
                  <FormLabel>Žinutė</FormLabel>
                  <Editor
                    editorStyle={
                      isMobile
                        ? { border: "1px solid black", height: "150px" }
                        : { border: "1px solid black", height: "300px" }
                    }
                    toolbarHidden={isMobile ? true : false}
                    editorState={message}
                    onEditorStateChange={(editorState) =>
                      setMessage(editorState)
                    }
                    wrapperClassName={"rte-wrapper"}
                    toolbarClassName={"rte-wrapper"}
                    editorClassName={"rte-wrapper"}
                  />
                </>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                bg={"blue.500"}
                color={"black"}
                borderRadius={"50px 50px 50px 50px"}
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
