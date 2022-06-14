const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }

  throw new Error("Invalid Arguments");
};

// the try-catch block doesn't allow the whole app to crash and have the app continue to run
// this is only for synchronous code
try {
  console.log(sum(1));
} catch (error) {
  console.log("Error occurred!");
  // console.log(sum(1));
}

// then-catch blocks are for async code

console.log("this works!");
