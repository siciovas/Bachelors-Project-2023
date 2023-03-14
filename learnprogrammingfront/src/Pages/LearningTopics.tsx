import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Box, Image, Badge, Grid, useToast, Spinner, Flex } from "@chakra-ui/react";
import { Difficulty, LearningTopicTypes } from "./Types/LearningTopicsTypes";
import { useNavigate } from "react-router-dom";
import { GetTopicDifficulty } from "../Helpers/GetTopicDifficulty";
import { GetDifficultyColor } from "../Helpers/GetDifficultyColor";
import { AddNewLearningTopic } from "../Components/AddNewLearningTopic";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import { DeleteIcon } from "@chakra-ui/icons";

const LearningTopics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [topics, setTopics] = useState<LearningTopicTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const NavigateToSubTopics = (learningTopicId: number) => {
    navigate("/potemes", {
      state: {
        learningTopicId: learningTopicId,
      },
    });
  };

  const AddLearningTopic = useCallback(async (e: FormEvent<HTMLFormElement>, title: string, photo: string, difficultyInText: Difficulty): Promise<void> => {
    e.preventDefault();
    const response = await fetch("https://localhost:7266/api/learningtopic", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        title,
        photo,
        difficultyInText,
      }),
    });
    if (response.status === 401) {
      eventBus.dispatch("logOut", "");
    }
    else if (response.status === 201) {
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
  }, []);

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
    }
    else if (response.status === 200) {
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

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left='50%' position='fixed'>
        <Spinner size='xl' />
      </Flex>
    )
  }

  return (
    <Grid margin={20} templateColumns="repeat(4, 1fr)" gap={6}>
      <AddNewLearningTopic AddLearningTopic={AddLearningTopic} />
      {topics.map((topic) => {
        return (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image
              cursor={"pointer"}
              onClick={() => NavigateToSubTopics(topic.id)}
              maxWidth="100%"
              maxHeight="100%"
              src={"data:image/jpeg;base64," + topic.photo}
            />

            <Box p="6">
              <Box display="flex" alignItems="baseline">
                <Badge
                  borderRadius="full"
                  px="2"
                  colorScheme={GetDifficultyColor(topic.difficultyInText)}
                >
                  {GetTopicDifficulty(topic.difficultyInText)}
                </Badge>
                <Box
                  color="gray.500"
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
              <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                noOfLines={1}
              >
                {topic.title}
              <Flex justify="flex-end">
              <DeleteIcon cursor={"pointer"}/>
              </Flex>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

export { LearningTopics };
