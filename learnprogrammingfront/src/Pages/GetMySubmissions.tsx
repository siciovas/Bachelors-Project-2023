import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { SubmissionTypes } from "../Types/SubmissionTypes";
import eventBus from "../Helpers/EventBus";
import { Unauthorized } from "../Constants/Auth";
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";

const GetMySubmissions = () => {
  const token = localStorage.getItem("accessToken");
  const [submissions, setSubmissions] = useState<SubmissionTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAccordionClick = (index: number) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };
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
      toast.error("Netikėta klaida!");
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
        <Heading mt={15} size="lg">
          Mano prašymai
        </Heading>
      </Flex>
      <Accordion
        allowToggle
        width={"50%"}
        m={"auto"}
        mt={5}
        border={"transparent"}
        mb={7}
      >
        {submissions.map((submission, index) => (
          <AccordionItem>
            <AccordionButton
              onClick={() => handleAccordionClick(index)}
              _focus={{ boxShadow: "none" }}
              _hover={{ backgroundColor: "transparent" }}
              _active={{ backgroundColor: "transparent" }}
              backgroundColor={expandedIndex === index ? "gray.200" : "white"}
              borderRadius="full"
              border="1px"
              borderColor="gray.400"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              px={4}
              py={2}
              transition="background-color 0.2s ease-out"
              _expanded={{ backgroundColor: "gray.200" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              mt={2}
            >
              <Box
                as={FaChevronDown}
                mr={3}
                w={4}
                h={4}
                borderRadius="full"
                backgroundColor="gray.400"
              />
              {submission.topic}
            </AccordionButton>
            <AccordionPanel
              background={"white"}
              borderRadius={"50px 50px 50px 50px"}
              display={expandedIndex === index ? "block" : "none"}
            >
              <Box
                textAlign={"center"}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    submission.message as unknown as Node
                  ),
                }}
              ></Box>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export { GetMySubmissions };
