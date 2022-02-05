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

##
