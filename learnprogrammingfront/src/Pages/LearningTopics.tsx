import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Box,
  Badge,
  Grid,
  useToast,
  Spinner,
  Flex,
  Text,
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

const LearningTopics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [topics, setTopics] = useState<LearningTopicTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const role = localStorage.getItem("role");

  const NavigateToSubTopics = (learningTopicId: number) => {
    navigate("/potemes", {
      state: {
        learningTopicId: learningTopicId,
      },
    });
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
        toast({
          title: "Tema pridėta",
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
      setIsLoading(false);
    } else {
      toast({
        title: "Netikėta klaida",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
      });
    }
  }, []);

  useEffect(() => {
    getLearningTopics();
  }, [isLoading]);

  const deleteLearningTopic = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
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
      toast({
        title: "Tema ištrinta",
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

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Grid margin={20} templateColumns="repeat(4, 1fr)" gap={6}>
        {role === UserRole.Teacher && (
          <>
            <AddNewLearningTopic AddLearningTopic={AddLearningTopic} />
          </>
        )}
        {topics.map((topic) => {
          return (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              borderColor={"black"}
              overflow="hidden"
            >
              <Flex
                cursor={"pointer"}
                onClick={() => NavigateToSubTopics(topic.id)}
                width=""
                height="100px"
                align={"center"}
                justify={"center"}
              >
                <Text
                  color={"black"}
                  textTransform="uppercase"
                  fontWeight={"bold"}
                >
                  {topic.title}
                </Text>
              </Flex>

              <Box
                p="6"
                borderWidth="1px 0px 0px 0px"
                borderRadius={"md"}
                borderColor={"black"}
              >
                <Box display="flex" alignItems="baseline">
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
                  >
                    {topic.numberOfSubTopics} potemės/ių &bull;{" "}
                    {topic.numberOfAllTasks} uždaviniai/ių
                  </Box>
                </Box>
                {role === UserRole.Teacher && (
                  <>
                    <Flex justify="flex-end" mt={4}>
                      <DeleteIcon
                        cursor={"pointer"}
                        color={"red.500"}
                        onClick={(e) => deleteLearningTopic(e, topic.id)}
                      />
                    </Flex>
                  </>
                )}
              </Box>
            </Box>
          );
        })}
      </Grid>
    </>
  );
};

export { LearningTopics };
