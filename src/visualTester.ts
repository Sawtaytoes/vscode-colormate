import { importTest } from "./visualTester-import"

importTest()

const someFunction = ({} = {}) => {}
const someFunction2 = ({}) => {}
const someFunction3 = ({}) => {}
const someFunction4 = ({}) => {}
const yoyo = () => {}
const someFunction23 = () => {}
const someFunction20 = () => {}

someFunction
someFunction23
someFunction20
someFunction4

const returnValue = (
  someFunction({
    username: "admin",
    password: "password",
  })
)

someFunction() // This is the wrong color in Sublime Text because it colors the parens too.
someFunction2({})

console.log(
  returnValue
)
