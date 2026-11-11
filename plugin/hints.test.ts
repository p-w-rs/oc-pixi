import { test } from "node:test"
import assert from "node:assert/strict"
import { detect, hintText } from "./hints.js"

const kinds = (command: string) => detect(command).map(hint => hint.kind)

test("detects direct Python tooling in real-world command shapes", () => {
  assert.deepEqual(kinds("pip install numpy pandas"), ["pip"])
  assert.deepEqual(kinds("python3 -m pip install -r requirements.txt && python3 app.py"), ["pip", "python"])
  assert.deepEqual(kinds("cd src && uv run --script tool.py"), ["uv-script"])
  assert.deepEqual(kinds("uv pip install torch"), ["uv"])
  assert.deepEqual(kinds("uvx ruff check ."), ["uvx"])
  assert.deepEqual(kinds("python -m venv .venv && source .venv/bin/activate"), ["venv"])
  assert.deepEqual(kinds("conda create -n x python=3.12"), ["conda"])
  assert.deepEqual(kinds("poetry install"), ["poetry"])
  assert.deepEqual(kinds("/usr/bin/python3 -c 'print(1)'"), ["python-c"])
  assert.deepEqual(kinds("FOO=1 python train.py --epochs 3"), ["python"])
  assert.deepEqual(kinds("sudo apt-get install -y cmake"), ["system"])
  assert.deepEqual(kinds("brew install gnuplot"), ["system"])
  assert.deepEqual(kinds("ls -la; echo $(python --version)"), ["python-c"])
})

test("leaves Pixi and unrelated commands alone", () => {
  for (const command of ["pixi run python app.py", "pixi run --script tool.py", "pixi exec --spec numpy python -c 'import numpy'", "pixi add --pypi rich",
    ".pixi/envs/default/bin/python app.py", "git status", "npm test", "grep -r python .", "cat requirements.txt", "echo 'pip install x' > notes.md", "brew list"]) {
    assert.deepEqual(kinds(command), command.startsWith("echo") ? kinds(command) : [], command)
  }
  assert.deepEqual(kinds("pixi run pip install requests"), ["pip-in-pixi"])
})

test("hint text says the command ran and is empty without hints", () => {
  assert.equal(hintText([]), "")
  assert.match(hintText(detect("pip install rich")), /^\n\n\[oc-pixi\] This command ran as given\. Next time: Instead of pip install:.*pixi add/)
})
