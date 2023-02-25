import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LearningSubTopicsType } from './Types/LearningSubTopicsType';

const LearningSubTopics = () => {
  
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [topics, setTopics] = useState<LearningSubTopicsType[]>([]);
  const params = new URLSearchParams(window.location.pathname);
  const learningTopicId = params.get("learningTopicId");
  const {state} = useLocation();
  
  const NavigateToTask = (subtopicId : number) => {
    navigate({
      pathname: '/uzd',
      search: `?learningTopicId=${learningTopicId}&subtopicId=${subtopicId}`
    })
  }

  const getLearningSubTopics = useCallback(async () => {
    const topics = await fetch(`https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic`, {
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
    getLearningSubTopics();
  }, []);

  return (
    <Flex alignItems={"center"} gap={5}>
    {topics.map((topic) => {
    return (
      <Accordion defaultIndex={[0]} alignContent={"center"} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton width={600}>
              <Box as="div" flex="1" textAlign="center">
              {topic.subTopicName}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>

           {topic.tasks.map((subtask) => {
            return (
              <li>
                <Link to={""}>{subtask.name}</Link>
              </li>
            );
           })}

          </AccordionPanel>
        </AccordionItem>
      </Accordion>
       );
      })}
    </Flex>
  );
};

export { LearningSubTopics };
