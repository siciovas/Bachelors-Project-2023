import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Badge,
  Grid,
  Spinner,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Difficulty, LearningTopicTypes } from "../Types/LearningTopicsTypes";
import { useNavigate } from "react-router-dom";
import { GetTopicDifficulty } from "../Helpers/GetTopicDifficulty";
import { GetDifficultyColor } from "../Helpers/GetDifficultyColor";
import { AddNewLearningTopic } from "../Components/AddNewLearningTopic";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserRole } from "../Constants/RolesConstants";
import toast from "react-hot-toast";
import { GetRandomPhotos } from "../Helpers/GetRandomPhotos";
// @ts-ignore
import Fade from "react-reveal/Fade";

const LearningTopics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [topics, setTopics] = useState<LearningTopicTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem("role");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deletingId, setDeletingId] = useState<number>();
  const [photos, setPhotos] = useState<string[]>([]);

  const NavigateToSubTopics = (learningTopicId: number) => {
    navigate("/potemes", {
      state: {
        learningTopicId: learningTopicId,
      },
    });
  };

  const openModal = (id: number) => {
    setDeletingId(id);
    onOpen();
  };

  const AddLearningTopic = useCallback(
    async (
      e: FormEvent<HTMLFormElement>,
      title: string,
      difficultyInText: Difficulty
    ): Promise<void> => {
      e.preventDefault();
      const response = await fetch(`https://localhost:7266/api/learningtopic`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          title,
          difficultyInText,
        }),
      });
      if (response.status === 401) {
        eventBus.dispatch("logOut", "");
      } else if (response.status === 201) {
        setIsLoading(true);
        toast.success("Tema pridėta!");
      } else {
        toast.error("Nepavyko!");
      }
    },
    []
  );

  const getLearningTopics = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/learningtopic`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const allTopics = await response.json();
      setTopics(allTopics);
      const photosArray = allTopics.map(() => GetRandomPhotos());
      setPhotos(photosArray);
      setIsLoading(false);
    } else {
      toast.error("Netikėta klaida!");
    }
  }, []);

  useEffect(() => {
    getLearningTopics();
  }, [isLoading]);

  const deleteLearningTopic = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    learningTopicId: number
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${learningTopicId}`,
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
      toast.success("Tema ištrinta!");
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
      <Flex mt={5} justify="center">
        <Heading size="lg">Kursai</Heading>
      </Flex>
      <Grid
        margin={18}
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        gap={6}
      >
        {role === UserRole.Teacher && (
          <>
            <AddNewLearningTopic AddLearningTopic={AddLearningTopic} />
          </>
        )}
          {topics.map((topic, index) => {
            return (
                <Fade left>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={"black"}
                  overflow="hidden"
                  bg={"whitesmoke"}
                >
                  <Flex
                    cursor={"pointer"}
                    height="100px"
                    align={"center"}
                    justify={"center"}
                    onClick={() => NavigateToSubTopics(topic.id)}
                    bg={`url(${photos[index]})`}
                  ></Flex>
                  <Box
                    p="6"
                    borderWidth="1px 0px 0px 0px"
                    borderRadius={"md"}
                    borderColor={"black"}
                  >
                    <Box height={55}>
                      <Text
                        color={"black"}
                        textTransform="uppercase"
                        fontWeight={"bold"}
                        fontSize={{ base: "x-small", sm: "md" }}
                        textAlign={"center"}
                        cursor={"pointer"}
                        onClick={() => NavigateToSubTopics(topic.id)}
                      >
                        {topic.title}
                      </Text>
                    </Box>
                    <Box mt={3} display="flex" alignItems="baseline">
                      <Badge
                        borderRadius="full"
                        px="2"
                        colorScheme={GetDifficultyColor(topic.difficultyInText)}
                      >
                        {GetTopicDifficulty(topic.difficultyInText)}
                      </Badge>
                      <Box
                        color="black"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        ml="2"
                        display={{ base: "none", xl: "block" }}
                      >
                        {topic.numberOfSubTopics} potemės/ių &bull;{" "}
                        {topic.numberOfAllTasks} uždaviniai/ių
                      </Box>
                    </Box>
                    {(role === UserRole.Teacher || role === UserRole.Admin) && (
                      <>
                        <Flex justify="flex-end" mt={4}>
                          <DeleteIcon
                            cursor={"pointer"}
                            color={"red.500"}
                            onClick={() => openModal(topic.id)}
                          />
                        </Flex>
                      </>
                    )}
                  </Box>
                </Box>
          </Fade>
              );
            })}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Perspėjimas!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Ar tikrai norite ištrinti temą?</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              background="red.500"
              mr={3}
              borderRadius={"50px 50px 50px 50px"}
              onClick={(e) => deleteLearningTopic(e, deletingId as number)}
            >
              Ištrinti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { LearningTopics };
