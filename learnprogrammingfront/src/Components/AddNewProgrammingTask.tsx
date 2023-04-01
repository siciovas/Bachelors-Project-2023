import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { convertToRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { isMobile } from "react-device-detect";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const AddNewProgrammingTask = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = React.useState<EditorState>(
    EditorState.createEmpty()
    );
    const token = localStorage.getItem("accessToken");
    const { state } = useLocation();
    const navigate = useNavigate();

  const onNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value as string);
  }
  const [fields, setFields] = useState([{ input: "", output: "" }]);
  const addField = () => {
    setFields([...fields, { input: "", output: "" }]);
  };

  const handleFieldChange = (
    index: number,
    field: keyof typeof fields[0],
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...fields];
    newFields[index][field] = event.target.value;
    setFields(newFields);
  };
  const deleteField = (index: number) => {
    if (fields.length > 1) {
      const newFields = [...fields];
      newFields.splice(index, 1);
      setFields(newFields);
    }
  };

  const CreateTask = async(
    e: FormEvent<HTMLFormElement>
  ) : Promise<void> => {
    e.preventDefault();
    const descriptionLength = convertToRaw(description.getCurrentContent()).blocks[0].text.trim().length;
    if(descriptionLength > 0)
      {
        const response = await fetch(`https://localhost:7266/api/learningtopic/${state.learningTopicId}/subtopic/${state.subTopicId}/task`, {
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: JSON.stringify({
            name,
            description: draftToHtml(convertToRaw(description.getCurrentContent())).replace(
              /\s+$/,
              ""
            ),
            inputOutput: fields,
          }),
        });
        if (response.status === 201) {
          const id = await response.json();
          toast.success("Užduotis sukurta!");
          navigate(`/uzduotis`,{
            state: {
              learningTopicId: state.learningTopicId,
              subTopicId: state.subTopicId,
              taskId: id,
            },
          })
        } else {
          toast.error("Nepavyko!");
        }
      }
      else{
        toast.error("Sukurti užduoties su tuščiu aprašymu neįmanoma!"); 
      }
    };

  return (
    <>
      <Flex justify={"center"}>
        <Heading mt={4} size={"lg"}>
          Naujos užduoties kūrimas
        </Heading>
      </Flex>
      <form onSubmit={(e) => CreateTask(e)}>
      <Flex justify={"center"}>
        <FormControl mt={4} isRequired width={"50%"}>
          <FormLabel>Pavadinimas</FormLabel>
          <Input type={"text"} backgroundColor={"white"} onChange={(e) => onNameChange(e)}/>
        </FormControl>
      </Flex>
      <Flex justify={"center"}>
        <FormControl mt={4} isRequired width={"50%"}>
          <FormLabel>Užduoties aprašymas</FormLabel>
          <Editor
            editorStyle={ isMobile ? { border: "1px solid black", height:"150px", background:"white" } : { border: "1px solid black", height:"300px",  background:"white" }}
            editorState={description}
            onEditorStateChange={(editorState) => setDescription(editorState)}
            wrapperClassName={"rte-wrapper"}
            toolbarClassName={"rte-wrapper"}
            toolbarHidden={isMobile ? true : false}
            editorClassName={"rte-wrapper"}
          />
        </FormControl>
      </Flex>
      <Flex justify={"start"} width={"50%"} margin={"auto"}>
        <FormLabel mt={4}>Testai</FormLabel>
      </Flex>
      <Flex width={"50%"} margin={"auto"}>
        <Flex width={"50%"}>
          <FormLabel>Įvestis</FormLabel>
        </Flex>
        <Flex width={"50%"}>
          <FormLabel>Išvestis</FormLabel>
        </Flex>
      </Flex>
      {fields.map((field, index) => (
        <Flex justify={"center"} width={"50%"} margin={"auto"}>
          <FormControl>
            <Input
              type={"text"}
              value={field.input}
              backgroundColor={"white"}
              onChange={(e) => handleFieldChange(index, "input", e)}
            />
          </FormControl>
          <FormControl>
            <Input
              type={"text"}
              value={field.output}
              backgroundColor={"white"}
              onChange={(e) => handleFieldChange(index, "output", e)}
            />
          </FormControl>
          {fields.length > 1 && (
            <Flex alignItems={"center"} ml={4}>
              <DeleteIcon
                onClick={() => deleteField(index)}
                cursor={"pointer"}
              />
            </Flex>
          )}
        </Flex>
      ))}
      <Flex justify={"center"}>
        <Heading
          size={"sm"}
          background={"none"}
          fontWeight={"none"}
          mt={4}
          onClick={addField}
          cursor={"pointer"}
          color={"black"}
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
          Pridėti testą
        </Heading>
      </Flex>
      <Flex mt={5} justify={"center"}>
        <Button
          type="submit"
          bg={"green.500"}
          borderRadius={"50px 50px 50px 50px"}
          color={"white"}
          _hover={{
            bg: "green",
          }}
        >
          Sukurti
        </Button>
      </Flex>
      </form>
    </>
  );
};

export { AddNewProgrammingTask };
