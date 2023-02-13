import React, { useCallback, useEffect, useState } from "react";
import { Box, Image, Badge, Grid } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { LearningTopic } from "./Types/LearningTopicsTypes";
import { useNavigate } from "react-router-dom";

const LearningTopics = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [topics, setTopics] = useState<LearningTopic[]>([]);

  const getLearningTopics = useCallback(async () => {
    const topics = await fetch(`https://localhost:7266/api/learningtopics`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    const allTopics = await topics.json();
    setTopics(allTopics);
  }, []);

  useEffect(() => {
    getLearningTopics();
  }, []);

  return (
    <Grid margin={20} templateColumns="repeat(4, 1fr)" gap={6}>
      {topics.map((topic) => {
        return (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image
              cursor={"pointer"}
              onClick={() => navigate("/uzdaviniai")}
              maxWidth="100%"
              maxHeight="100%"
              src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg"
            />

            <Box p="6">
              <Box display="flex" alignItems="baseline">
                <Badge borderRadius="full" px="2" colorScheme="teal">
                  {topic.difficultyInText}
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
              </Box>

              <Box display="flex" mt="2" alignItems="center">
                Sunkumas:
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={
                        i < topic.difficultyInStars ? "teal.500" : "gray.300"
                      }
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

export { LearningTopics };
