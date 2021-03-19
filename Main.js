
/*
    Parse program and convert it into machine code.
*/

const FS    = require("fs");
const Ops   = require("./Utils/Opcodes.json");
const Schem = require("./Schem");

const ToSignedBin = (Dec, Length) => (Dec >>> 0)
    .toString(2)
    .split("")
    .reverse()
    .slice(0, Length)
    .reverse()
    .join("")
    .padStart(Length, "0");

FS.readdirSync("./Program").forEach(File => {

    // Should be an ASM file
    if (!/^.*\.(s)$/.test(File)) return;

    let LineIdx = 0;

    // Create an indexed instruction list
    const Program = FS.readFileSync(`./Program/${File}`, "utf8")
        .split("\n")
        .map(Instruction => Instruction.replace(/(;.*\n)/g, "").trim().split(" ").slice(0, 2))
        .filter(Instruction => Instruction[0]?.length)
        .map(Instruction => {
            if (Instruction[1]) {
                Instruction[1] = Instruction[1].replace("$", "");
            }

            return Instruction;
        })
        .map(Instruction => {
            if (/\..*\:/.test(Instruction[0])) return {
                Instruction,
                Line: LineIdx,
                Type: "tag"
            };

            return {
                Instruction,
                Line: LineIdx++,
                Type: "operation"
            };
        });

    const Tags = Program.filter(L => L.Type == "tag");
    console.log(Program.map(L => L.Instruction));
    const Output = [];

    // Iterate through the program
    Program
    .filter(Instruction => Instruction.Type === "operation")
    .forEach(Line => {
        const Opcode = Ops[Line.Instruction[0]];
        const Argument = Tags.find(Tag => Tag.Instruction[0] === `${Line.Instruction[1]}:`);
        if (!Opcode) return Output.push(ToSignedBin(parseInt(Line.Instruction[0]), 8));
        Output.push(Opcode + ToSignedBin(parseInt(Argument?.Line ?? Line.Instruction[1] ?? 0), ["DIM", "JMP", "MST", "MLD"].includes(Line.Instruction[0]) ? 5 : 3));
        if (process.argv.includes("--debug")) console.log(Line.Instruction[0], Argument?.Line ?? Line.Instruction[1] ?? 0); // Instruction log, no immediates
    });

    return Schem(File, Output);

});
