import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { defineTheme } from "../defineTheme";
import { run, runTest } from "./compiler";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import { ProgrammingTaskTypes } from "../Types/ProgrammingTaskTypes";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import { ProgrammingTaskTest } from "../Types/ProgrammingTaskTest";

interface ThemeType {
  value: string;
  label: string;
}

const ProgrammingTask = () => {
  const [value, setValue] = useState<string>("");
  const [code, setCode] = useState();
  const [theme, setTheme] = useState<ThemeType>();
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state } = useLocation();
  const token = localStorage.getItem("accessToken");
  const [taskInformation, setTaskInformation] =
    useState<ProgrammingTaskTypes>();
  const [taskTests, setTaskTests] = useState<ProgrammingTaskTest[]>([]);
  const [grade, setGrade] = useState<number>();

  const openModal = () => {
    onOpen();
  };

  const postGrade = async (mark: number): Promise<void> => {
    const response = await fetch(`https://localhost:7266/api/grades`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        grade: mark,
        programmingTaskId: state.taskId,
      }),
    });
    if (response.status === 401) {
      eventBus.dispatch("logOut", "");
    } else if (response.status === 201 || response.status === 200) {
      toast.success("Įvertinta!");
    } else {
      toast.error("Nepavyko!");
    }
  };

  const getProgrammingTaskInformation = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subTopicId}/task/${state.taskId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const taskInfo = await response.json();
      setTaskInformation(taskInfo);
      setCode(taskInfo.programmingCode);
      setTaskTests(taskInfo.tests);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  useEffect(() => {
    getProgrammingTaskInformation();
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const compile = async () => {
    await Promise.resolve(run(code))
      .then(() => {
        var output = document.getElementById("output") as any;
        setValue(output.value);
      })
      .catch((result) => {
        toast.error("Kode yra klaidų. Klaidos informacija išvesties eilutėje!");
        setValue(result);
      });
  };

  const evaluate = async () => {
    var testsPassed = 0;
    var mark = 0;
    await Promise.all(
      taskTests?.map(async (test) => {
        const result = await runTest(code, test.input);
        console.log(result);
        if (result.toString().trim() === test.output.toString().trim()) {
          testsPassed++;
        }
      })
    )
      .then(() => {
        mark = (testsPassed / taskTests.length) * 100;
        setGrade(mark);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Kodas neatitinka reikalavimų");
      });
    await postGrade(mark);
  };

  const handleEditorChange = (value: any) => {
    setCode(value);
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        <Heading size="sm" paddingRight={1}>
          Kurso tema:
        </Heading>
        <Heading size="sm" fontWeight={"none"}>
          {taskInformation?.learningTopicName}
        </Heading>
      </Flex>
      <Flex>
        <Heading size="sm" paddingRight={1}>
          Potemė:
        </Heading>
        <Heading size="sm" fontWeight={"none"}>
          {taskInformation?.subTopicName}
        </Heading>
      </Flex>
      <Flex>
        <Heading size="sm" paddingRight={1}>
          Uždavinys:
        </Heading>
        <Heading size="sm" fontWeight={"none"}>
          {taskInformation?.name}
        </Heading>
      </Flex>
      <Flex mt={5} width="100%">
        <Flex flexDirection={"column"} width="50%">
          <Flex mt={5}>
            <Button
              onClick={compile}
              bg={"green.500"}
              textColor={"white"}
              _hover={{
                bg: "green.700",
              }}
            >
              Kompiliuoti
            </Button>
            <Button
              onClick={openModal}
              bg={"orange.500"}
              textColor={"white"}
              _hover={{
                bg: "orange.700",
              }}
            >
              Gauti įvertinimą
            </Button>
          </Flex>
          <Editor
            height="50vh"
            width={"100%"}
            language={"python"}
            theme={theme?.value}
            onChange={handleEditorChange}
            value={taskInformation?.programmingCode}
          />
          Išvestis
          <Input
            disabled
            _disabled={{
              backgroundColor: "#1b2b34",
              textColor: "white",
            }}
            id="output"
            value={value}
          />
          <Box>Įvertis: {grade}%</Box>
        </Flex>
        <Flex mt={5} mr={5} ml={20} flexDirection="column" w="50%">
          <Heading size="sm">Užduoties aprašymas</Heading>
          <Box
            mt={5}
            border={"1px solid black"}
            height={"50vh"}
            bg={"white"}
            overflow={"auto"}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                taskInformation?.description as unknown as Node
              ),
            }}
          ></Box>
        </Flex>
      </Flex>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Perspėjimas!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Ar tikrai norite išsaugoti programos kodą ir gauti siūlomą
                įvertį? Atlikus šį veiksmą, grįžti atgal nebebus galima.
              </Text>
              <Text mt={3} textColor="green.500">
                Norėdami pateikti programos kodą testavimui - paspauskite
                mygtuką "Įvertinti!"
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                background="green.500"
                mr={3}
                color={"white"}
                borderRadius={"50px 50px 50px 50px"}
                _hover={{
                  bg: "green.700",
                }}
                onClick={evaluate}
              >
                Įvertinti!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export { ProgrammingTask };
