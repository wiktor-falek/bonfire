# Resultat - Typed Result Handling for JS/TS

## Description

Resultat is a TypeScript library designed to simplify error handling and provide a structured approach for dealing with success and error scenarios. The library introduces a custom **Result** type along with utility functions to deal with the outcome. By leveraging Resultat, you can enhance the reliability and clarity of error handling in your TypeScript projects.

## Installation

To start using Resultat in your TypeScript project, you can install it via npm or yarn:

```bash
npm install resultat

# or

yarn add resultat
```

## Usage Example: Dividing Two Numbers

Consider a simple use case of dividing two numbers. The divideNumbers function returns either an **Ok** result containing the division result or an **Err** result with an error message if division by zero occurs.

```ts
import { Ok, Err } from "resultat";
import type { Result } from "resultat";

// Simple example: Divide Two Numbers
function divideNumbers(a: number, b: number): Result<number> {
  return b === 0 ? Err("Cannot divide by 0") : Ok(a / b);
}
```

## Unpacking `result.ok`

Before retrieving the value from the result, you have to confirm whether the result returned **Ok** or **Err**, using type narrowing. Here's how you can achieve this:

```ts
const result = divideNumbers(10, 0);

if (result.ok) {
  console.log("Division result:", result.val);
} else {
  // Handle the Err case
  console.error("Error:", result.err);
}
```

## `unwrap`: Extracting Values from Ok

The **unwrap** function allows you to extract the value from an **Ok** result. If the result is an **Err**, it throws an error. Use it when you need to assert that result is **Ok**.

```ts
// Success
const result = divideNumbers(10, 2);
const value = result.unwrap(); // Returns 5

// Failure
const result = divideNumbers(10, 0);
const value = result.unwrap(); // Throws the error
```

## `unwrapOr`: Providing a Default Value

The **unwrapOr** function extracts the value from an **Ok** result or returns a provided default value if the result is an **Err**. This is useful when you want to ensure a fallback value in case of errors.

```ts
const result = divideNumbers(10, 0);
const num = result.unwrapOr(0); // Returns 0 since division by 0 results in an Err
```

## `unwrapOrElse`: Providing a Callback

The **unwrapOrElse** function is used to extract the value from an **Ok** result or execute a provided callback to handle the **Err** result and provide a fallback value.

```ts
const result = divideNumbers(10, 0);
const num = result.unwrapOrElse((errorMessage) => {
  console.error(errorMessage, "Defaulting to 0");
  return 0; // Fallback value provided by the callback
});
```

## Realistic Example: Retrieving User Data with Error Handling

In real-world applications, fetching user data from a database or API can result in various outcomes. The **Result** type provided by Resultat can simplify error handling and result management. Consider the following example:

### Function Explanation

The following function attempts to retrieve user data based on a provided username.

- If a user is found, the function returns an Ok result containing the user object.
- If no user is found, the function returns an Err result indicating that the user was not found.
- If UserModel.findByUsername throws, the function returns an Err result with a generic error message.

```ts
function findUser(username: string) {
  try {
    const user = UserModel.findByUsername(username);
    if (user === null) {
      return Err("User not found");
    }
    return Ok(user);
  } catch (e) {
    return Err("Something went wrong");
  }
}
```

## Annotating Return Types with Resultat

Resultat allows you to annotate return types explicitly, ensuring clarity in intentions and outcomes of your code.

Consider a scenario where you have a function returning user data in an Ok result. By annotating the return type, you ensure that the function returns an Ok path with specified shape. The function can also return any amount of Err results.

```ts
type UserData = {
  username: string;
  hash: string;
  isAdmin: boolean;
};

function findUser(username: string): Result<UserData> {
  // ...
  if (true) {
    return Err("Something went wrong");
  }
  // ...
  return Ok(user);
}
```
