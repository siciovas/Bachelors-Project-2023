import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Spinner,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { SubmissionTypes } from "../Types/SubmissionTypes";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";

const GetMySubmissions = () => {
  const token = localStorage.getItem("accessToken");
  const [submissions, setSubmissions] = useState<SubmissionTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { state } = useLocation();

  const getSubmissions = useCallback(async () => {
    const response = await fetch(`https://localhost:7266/api/submission`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    if (response.status === 401) {
      eventBus.dispatch("logOut", Unauthorized);
    } else if (response.status === 200) {
      const submission = await response.json();
      setSubmissions(submission);
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
    getSubmissions();
  }, [isLoading]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" top="50%" left="50%" position="fixed">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Flex justifyContent={"center"}>
        <Heading mt={15} size={"xl"}>
          Mano prašymai
        </Heading>
      </Flex>
      <Accordion allowToggle width={"50%"} m={"auto"} mt={5}>
        {submissions.map((submission) => {
          return (
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="center">
                    {submission.topic}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} textAlign={"center"}>
                <Box dangerouslySetInnerHTML={
                  {
                    __html: DOMPurify.sanitize(submission.message as unknown as Node)
                  }
                }>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};

export { GetMySubmissions };
