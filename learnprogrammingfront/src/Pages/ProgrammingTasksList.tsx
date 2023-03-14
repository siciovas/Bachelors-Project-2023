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
import { AddNewProgramminTask } from "../Components/AddNewProgrammingTask";
import { LearningSubTopicsType } from "./Types/LearningSubTopicsType";
import { ProgrammingTaskTypes } from "./Types/ProgrammingTaskTypes";
import { DeleteIcon } from "@chakra-ui/icons";

const ProgrammingTasksList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { state } = useLocation();
  const [subTopic, setSubTopic] = useState<LearningSubTopicsType>();
  const [tasks, setTasks] = useState<ProgrammingTaskTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const NavigateToTask = (id: number) => {
    navigate("/uzduotis", {
      state: {
       learningTopicId: state.learningTopicId,
       subtopicId: state.subtopicId,
       id: id
      },
    });
  };

  const getLearningSubTopicName = useCallback(async () => {
    const response = await fetch(
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subtopicId}`,
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
      `https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subtopicId}/task`,
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
            <Heading size={"lg"}>„{subTopic?.subTopicName}“ užduotys</Heading>
          </Box>
        </Flex>
        <AddNewProgramminTask/>
        {tasks.map((task) => {
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
                      onClick={() => NavigateToTask(task.id)}
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
                        backgroundColor: "grey",
                        transform: "scaleX(0)",
                        transformOrigin: "bottom right",
                        transition: "transform 0.25s ease-out",
                      }}
                    >
                      {task.name}
                    </Heading>
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

export { ProgrammingTasksList };
