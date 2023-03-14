import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { LearningSubTopicsType } from "./Types/LearningSubTopicsType";
import { LearningTopicTypes } from "./Types/LearningTopicsTypes";
import { AddNewSubTopic } from "../Components/AddNewSubTopic";
import { DeleteIcon } from "@chakra-ui/icons";

const LearningSubTopics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [subtopics, setSubTopics] = useState<LearningSubTopicsType[]>([]);
  const { state } = useLocation();
  const [topic, setTopic] = useState<LearningTopicTypes>();
  const [isLoading, setIsLoading] = useState(true);

  const NavigateToTask = (subtopicId: number) => {
    navigate("/uzduotys", {
      state: {
        learningTopicId: state.learningTopicId,
        subtopicId: subtopicId,
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
  }, []);

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left='50%' position='fixed'>
        <Spinner size='xl' />
      </Flex>
    )
  }

  return (
    <Box className="container mt-5">
      <Grid className="col-md-12">
        <Flex justifyContent={"center"}>
          <Box>
            <Heading size={"lg"}>„{topic?.title}“ potemės</Heading>
          </Box>
        </Flex>
        <AddNewSubTopic/>
        {subtopics.map((subtopic) => {
          return (
            <Box mt={3}>
              <Flex flexDir={"column"}>
                <Flex
                  justifyContent={"space-between"}
                  border={"1px solid #e3dada"}
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
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                      size={"sm"}
                      cursor={"pointer"}
                      onClick={() => NavigateToTask(subtopic.subTopicId)}
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
                        backgroundColor: "grey",
                        transform: "scaleX(0)",
                        transformOrigin: "bottom right",
                        transition: "transform 0.25s ease-out",
                      }}
                    >
                      {subtopic.subTopicName}
                    </Heading>
                    <Box
                      color="gray.500"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                    >
                      uždaviniai/ių: {subtopic.numberOfTasks}
                    </Box>
                    <Button colorScheme={"green"} variant="outline">
                      Pažymėti kaip atliktą
                    </Button>
                    <DeleteIcon cursor={"pointer"}/>
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
