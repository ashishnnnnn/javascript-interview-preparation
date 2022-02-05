## Callback

- Call back are the function which runs after a asynchronus task got completed. This is basically used to do something when that particular task got completed .

- A function that does something asynchronously should provide a callback argument where we put the function to run after it’s complete.

- How can we load two scripts sequentially: the first one, and then the second one after it? (Callback in Callback)

- The convention is

  - (1). The first argument of the callback is reserved for an error if it occurs. Then callback(err) is called.
  - (2). The second argument (and the next ones if needed) are for the successful result. Then callback(null, result1, result2…) is called.

- Pyramid of Doom

  ```js
  loadScript("1.js", function (error, script) {
    if (error) {
      handleError(error);
    } else {
      // ...
      loadScript("2.js", function (error, script) {
        if (error) {
          handleError(error);
        } else {
          // ...
          loadScript("3.js", function (error, script) {
            if (error) {
              handleError(error);
            } else {
              // ...continue after all scripts are loaded (*)
            }
          });
        }
      });
    }
  });
  ```

- Now let suppose we have to do a lot of async call but one after other, then this nesting will grow, a right skewed structure will appear which we called pyramid of doom.

- We can try to alleviate the problem by making every action a standalone function, like this:

```js
loadScript("1.js", step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript("2.js", step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript("3.js", step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...continue after all scripts are loaded (*)
  }
}
```

This code will work the same way . But here there are two demarits .

1). User have to make his eye jump from one code to another, as he is not aware of the code structure .

2). Here each step\* function is not getting used again, they are of single use .

So the main demarit of callback is the pyramid of doom .

---

## Promise

- The constructor syntax for a promise object is:

```js
let promise = new Promise(function (resolve, reject) {
  // executor (the producing code, "singer")
});
```

- When the executor obtains the result, be it soon or late, doesn’t matter, it should call one of these callbacks

  - (1). resolve(value) — if the job is finished successfully, with result value.

  - (2). reject(error) — if an error has occurred, error is the error object.

- The promise object returned by the new Promise constructor has these internal properties

  - (1). state — initially "pending", then changes to either "fulfilled" when resolve is called or "rejected" when reject is called

  - (2). result — initially undefined, then changes to value when resolve(value) called or error when reject(error) is called

- To summarize, the executor should perform a job (usually something that takes time) and then call resolve or reject to change the state of the corresponding promise object.

- **There can be only a single result or an error**

  - The executor should call only one resolve or one reject. Any state change is final.All further calls of resolve and reject are ignored:

  ```js
  let promise = new Promise(function (resolve, reject) {
    resolve("done");

    reject(new Error("…")); // ignored
    setTimeout(() => resolve("…")); // ignored
  });
  ```

- then

  - The most important, fundamental one is .then.

  ```js
  promise.then(
    function (result) {
      /* handle a successful result */
    },
    function (error) {
      /* handle an error */
    }
  );
  ```

  - The first argument of .then is a function that runs when the promise is resolved, and receives the result.

  - The second argument of .then is a function that runs when the promise is rejected, and receives the error.

- catch

  - If we’re interested only in errors, then we can use null as the first argument: .then(null, errorHandlingFunction). Or we can use .catch(errorHandlingFunction), which is exactly the same:

  **Note**

  - .catch also return a promise .

  ```js
  function fakeFetch(msg, shouldReject) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          reject(`error from server: ${msg}`);
        }
        resolve(`from server: ${msg}`);
      }, 3000);
    });
  }
  fakeFetch("hello", true)
    .catch(() => console.log("hello"))
    .then(() => console.log("i am the end"));
  ```

  - Here output is "hello, i am the end "

- finally

- A finally handler has no arguments. In finally we don’t know whether the promise is successful or not. That’s all right, as our task is usually to perform “general” finalizing procedures.

- A finally handler passes through results and errors to the next handler.

      ```js
      new Promise((resolve, reject) => {

      setTimeout(() => resolve("result"), 2000)
      })
      .finally(() => alert("Promise ready"))
      .then(result => alert(result)); // <-- .then handles the result

  ````

    ```js
      new Promise((resolve, reject) => {
          throw new Error("error");
        })
        .finally(() => alert("Promise ready"))
        .catch(err => alert(err));  // <-- .catch handles the error object
  ````

- question

- question 1

```js
let promise = new Promise(function (resolve, reject) {
  resolve(1);

  setTimeout(() => resolve(2), 1000);
});
promise.then(alert);
```

Answer - The Output is 1. Beacuse once the exexutator function has resolved . The below call will not be called .

---

## Promise Chaining

```js
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000); // (*)
})
  .then(function (result) {
    // (**)

    console.log(result); // 1
    return result * 2;
  })
  .then(function (result) {
    // (***)

    console.log(result); // 2
    return result * 2;
  })
  .then(function (result) {
    console.log(result); // 4
    return result * 2;
  });
```

- .then returns a new promise, so that we can call the next .then on it.

- When a handler returns a value, it becomes the result of that promise, so the next .then is called with it.

- **A classic newbie error: technically we can also add many .then to a single promise. This is not chaining.**

- **question**

  - Are these code fragments equal? In other words, do they behave the same way in any circumstances, for any handler functions?

  ```js
  promise.then(f1).catch(f2);

  promise.then(f1, f2);
  ```

  - The answer is no because when when some error got occured in `f1` , then that error will got passed and will be handled by .catch `f2` function.
    But here in second one if some error happend in f1 then that error will not be handled by anyone other function

---

## Error Handling with promise .

- Promise chains are great at error handling. When a promise rejects, the control jumps to the closest rejection handler. That’s very convenient in practice.

- **Implict Try catch**

  - The code of a promise executor and promise handlers has an "invisible try..catch" around it. If an exception happens, it gets caught and treated as a rejection.

  ```js
  new Promise((resolve, reject) => {
    throw new Error("Whoops!");
  }).catch(alert); // Error: Whoops!
  ```

  Above code works same as

  ```js
  new Promise((resolve, reject) => {
    reject(new Error("Whoops!"));
  }).catch(alert); // Error: Whoops!
  ```

- **Rethrowing**

  - As we already noticed, .catch at the end of the chain is similar to try..catch. We may have as many .then handlers as we want, and then use a single .catch at the end to handle errors in all of them.

  - If we throw inside .catch, then the control goes to the next closest error handler. And if we handle the error and finish normally, then it continues to the next closest successful .then handler.

  ```js
  // the execution: catch -> catch
  new Promise((resolve, reject) => {
    throw new Error("Whoops!");
  })
    .catch(function (error) {
      // (*)

      if (error instanceof URIError) {
        // handle it
      } else {
        alert("Can't handle such error");

        throw error; // throwing this or another error jumps to the next catch
      }
    })
    .then(function () {
      /* doesn't run here */
    })
    .catch((error) => {
      // (**)

      alert(`The unknown error has occurred: ${error}`);
      // don't return anything => execution goes the normal way
    });
  ```

  - The execution jumps from the first .catch (\*) to the next one (\*\*) down the chain.

- **Question**

  What do you think? Will the .catch trigger? Explain your answer.

  ```js
  new Promise(function (resolve, reject) {
    setTimeout(() => {
      throw new Error("Whoops!");
    }, 1000);
  }).catch(alert);
  ```

  So here error will be not handle , because try/error are synchrouns way of handling error in promise.
  When the exucatator function of promise obejct runs at that points this error will not run and thus it won't work later .

---
