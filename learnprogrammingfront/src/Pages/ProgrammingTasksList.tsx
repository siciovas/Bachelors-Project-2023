import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { LearningSubTopicsType } from "../Types/LearningSubTopicsType";
import { ProgrammingTaskTypes } from "../Types/ProgrammingTaskTypes";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserRole } from "../Constants/RolesConstants";
import toast from "react-hot-toast";

const ProgrammingTasksList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { state } = useLocation();
  const [subTopic, setSubTopic] = useState<LearningSubTopicsType>();
  const [tasks, setTasks] = useState<ProgrammingTaskTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletingId, setDeletingId] = useState<number>();

  const NavigateTo = (url: string, taskId?: number) => {
    navigate(url, {
      state: {
        learningTopicId: state.learningTopicId,
        subTopicId: state.subTopicId,
        taskId,
      },
    });
  };

  const openModal = (id: number) => {
    setDeletingId(id);
    onOpen();
  };

  const getLearningSubTopicName = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subTopicId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    const subTopic = await response.json();
    setSubTopic(subTopic);
  }, []);

  useEffect(() => {
    getLearningSubTopicName();
  }, []);

  const getProgrammingTasks = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subTopicId}/task`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    const allTasks = await response.json();
    setTasks(allTasks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getProgrammingTasks();
  }, [isLoading]);

  const deleteProgrammingTask = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: number
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subTopicId}/task/${taskId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      setIsLoading(true);
      toast.success("Uždavinys ištrintas!");
      onClose();
    } else {
      toast.error("Nepavyko ištrinti!");
    }
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
      <Box className="container" mt={10}>
        <Grid className="col-md-12">
          <Flex justifyContent={"center"}>
            <Box>
              <Heading textAlign={"center"} size={"lg"}>
                „{subTopic?.subTopicName}“ užduotys
              </Heading>
            </Box>
          </Flex>
          {role === UserRole.Teacher && (
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
                  onClick={() => NavigateTo("/kurtiuzduoti")}
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
                  Sukurti užduotį
                </Heading>
              </Flex>
            </>
          )}
          {tasks.map((task) => {
            return (
              <Box mt={3}>
                <Flex flexDir={"column"}>
                  <Flex
                    justifyContent={"space-between"}
                    border={"1px solid black"}
                    padding={"10px"}
                    borderRadius={"5px"}
                    marginTop={"12px"}
                    bg={"white"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Flex width="45%" align={"center"}>
                        <Heading
                          color="black"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          onClick={() => NavigateTo("/uzduotis", task.id)}
                          textTransform="uppercase"
                          size={"sm"}
                          cursor={"pointer"}
                          position="relative"
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
                          {task.name}
                        </Heading>
                      </Flex>
                      <Flex
                        justifyContent={"flex-end"}
                        align={"center"}
                        justify={"center"}
                      >
                        {(role === UserRole.Teacher ||
                          role === UserRole.Admin) && (
                          <DeleteIcon
                            cursor={"pointer"}
                            onClick={() => openModal(task.id)}
                            color={"red.500"}
                          />
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Grid>
      </Box>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Perspėjimas!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Ar tikrai norite ištrinti uždavinį?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                background="red.500"
                mr={3}
                borderRadius={"50px 50px 50px 50px"}
                onClick={(e) => deleteProgrammingTask(e, deletingId as number)}
              >
                Ištrinti
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export { ProgrammingTasksList };
