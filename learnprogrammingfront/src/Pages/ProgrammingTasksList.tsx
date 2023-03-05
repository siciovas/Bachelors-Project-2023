import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { LearningSubTopicsType } from "./Types/LearningSubTopicsType";
import { LearningTopicTypes } from "./Types/LearningTopicsTypes";
import { AddNewSubTopic } from "../Components/AddNewSubTopic";

const ProgrammingTasksList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [subtopics, setSubTopics] = useState<LearningSubTopicsType[]>([]);
  const { state } = useLocation();
  const [topics, setTopics] = useState<LearningTopicTypes>();

  const NavigateToTask = (subtopicId: number) => {
    navigate("/uzduotis", {
      state: {
        subtopicId: subtopicId,
      },
    });
  };

  // const getLearningTopics = useCallback(async () => {
  //   const response = await fetch(
  //     `https://localhost:7266/api/learningtopic/${state.learningTopicId}`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       method: "GET",
  //     }
  //   );
  //   const allTopics = await response.json();
  //   setTopics(allTopics);
  // }, []);

  // useEffect(() => {
  //   getLearningTopics();
  // }, []);

  // const getLearningSubTopics = useCallback(async () => {
  //   const response = await fetch(
  //     `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       method: "GET",
  //     }
  //   );
  //   const allTopics = await response.json();
  //   setSubTopics(allTopics);
  // }, []);

  // useEffect(() => {
  //   getLearningSubTopics();
  // }, []);

  return (
    <Box className="container mt-5">
      <Grid className="col-md-12">
        <Flex justifyContent={"center"}>
          <Box>
            <Heading size={"lg"}>„{topics?.title}“ potemės</Heading>
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
                      uždaviniai/ių:
                    </Box>
                    <Button colorScheme={"green"} variant="outline">
                      Pažymėti kaip atliktą
                    </Button>
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

export { ProgrammingTasksList };
