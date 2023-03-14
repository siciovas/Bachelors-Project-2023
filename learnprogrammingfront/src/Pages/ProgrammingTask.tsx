import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
import { run } from "./compiler";

const ProgrammingTask = () => {
    const [value, setValue] = useState();

    const compile = () => {
        run();
        var aa = document.getElementById("output") as any;
        setValue(aa.value)
    }

    return (
        <Box>
            <Textarea id="yourcode"></Textarea>
            <Button onClick={compile}>Run</Button>
            <Input id="output" value={value} />
            <Box>{value == 10 ? "GOOD" : "BAD"}</Box>
        </Box>
    )
}

export { ProgrammingTask }