import { Box, Button, Flex, Input, Spinner } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { defineTheme } from "../defineTheme";
import { run } from "./compiler";

interface ThemeType {
  value: string;
  label: string;
}

const ProgrammingTask = () => {
  const [value, setValue] = useState();
  const [code, setCode] = useState();
  const [theme, setTheme] = useState<ThemeType>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
    setIsLoading(false);
  }, []);

  const compile = () => {
    console.log(code);
    run(code);
    var aa = document.getElementById("output") as any;
    setValue(aa.value);
  };

  const handleEditorChange = (value: any) => {
    setCode(value);
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
      <Button onClick={compile}>Run</Button>
      <Editor
        height="50vh"
        width={`50%`}
        language={"python"}
        theme={theme?.value}
        onChange={handleEditorChange}
      />
      <Input id="output" disabled value={value} />
      <Box>{value == 10 ? "GOOD" : "BAD"}</Box>
    </>
  );
};

export { ProgrammingTask };
