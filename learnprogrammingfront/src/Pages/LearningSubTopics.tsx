import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { LearningSubTopicsType } from "../Types/LearningSubTopicsType";
import { LearningTopicTypes } from "../Types/LearningTopicsTypes";
import { AddNewSubTopic } from "../Components/AddNewSubTopic";
import { DeleteIcon } from "@chakra-ui/icons";
import { UserRole } from "../Constants/RolesConstants";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";

const LearningSubTopics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [subtopics, setSubTopics] = useState<LearningSubTopicsType[]>([]);
  const { state } = useLocation();
  const [topic, setTopic] = useState<LearningTopicTypes>();
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const role = localStorage.getItem("role");

  const NavigateToTask = (subTopicId: number) => {
    navigate("/uzduotys", {
      state: {
        learningTopicId: state.learningTopicId,
        subTopicId: subTopicId,
      },
    });
  };

  const getLearningTopicName = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    const allTopics = await response.json();
    setTopic(allTopics);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getLearningTopicName();
  }, [isLoading]);

  const getLearningSubTopics = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    const topic = await response.json();
    setSubTopics(topic);
  }, []);

  useEffect(() => {
    getLearningSubTopics();
  }, [isLoading]);

  const deleteLearningSubTopic = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    subTopicId: number
  ): Promise<void> => {
    e.preventDefault();
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${subTopicId}`,
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
      toast({
        title: "Potemė ištrinta",
        position: "top-right",
        status: "success",
        isClosable: true,
      });
    } else {
      toast({
        title: "Nepavyko ištrinti",
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    }
  };

  const AddLearningSubTopic = useCallback(
    async (
      e: FormEvent<HTMLFormElement>,
      subTopicName: string,
    ): Promise<void> => {
      e.preventDefault();
      const response = await fetch(`https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          subTopicName,
        }),
      });
      if (response.status === 401) {
        eventBus.dispatch("logOut", "");
      } else if (response.status === 201) {
        setIsLoading(true);
        toast({
          title: "Potemė pridėta",
          status: "success",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "Nepavyko",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      }
    },
    []
  );

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box className="container" mt={10}>
      <Grid className="col-md-12">
        <Flex justifyContent={"center"}>
          <Box>
            <Heading size={"lg"}>„{topic?.title}“ potemės</Heading>
          </Box>
        </Flex>
        {role === UserRole.Teacher && (
          <>
            <AddNewSubTopic AddLearningSubTopic={AddLearningSubTopic}/>
          </>
        )}
        {subtopics.map((subtopic) => {
          return (
            <Box mt={3}>
              <Flex flexDir={"column"}>
                <Flex
                  justifyContent={"space-between"}
                  border={"1px solid black"}
                  padding={"10px"}
                  borderRadius={"5px"}
                  marginTop={"12px"}
                >
                  <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    <Heading
                      color="black"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                      size={"sm"}
                      cursor={"pointer"}
                      onClick={() => NavigateToTask(subtopic.id)}
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
                      {subtopic.subTopicName}
                    </Heading>
                    <Box
                      color="black"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      uždaviniai/ių: {subtopic.numberOfTasks}
                    </Box>
                    <Button colorScheme={"green"} variant="outline">
                      Pažymėti kaip atliktą
                    </Button>
                    <DeleteIcon
                      cursor={"pointer"}
                      onClick={(e) => deleteLearningSubTopic(e, subtopic.id)}
                      color={"red.500"}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export { LearningSubTopics };
