const fakeFetch = (paramter, delay, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      paramter ? resolve(value) : reject(`Promise rejected! ${value}`);
    }, delay);
  });
};

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const ret_array = Array(promises.length);
    let counter = 0;
    promises.forEach((promise, index) => {
      promise
        .then((data) => {
          ret_array[index] = data;
          counter += 1;
          if (counter === promises.length) {
            resolve(ret_array);
          }
        })
        .catch(() => {
          reject("Got error");
        });
    });
  });
}

function recursive_promise_all(promises, ret = []) {
  return new Promise((resolve, reject) => {
    if (promises.length === ret.length) {
      return resolve(ret);
    }
    let index = ret.length;
    promises[index]
      .then((data) => {
        ret.push(data);
        recursive_promise_all(promises, ret)
          .then(() => {
            resolve(ret);
          })
          .catch(() => {
            reject("Error aa gaya");
          });
      })
      .catch(() => {
        reject("Error aa gaya");
      });
  });
}

promiseAll([
  fakeFetch(true, 100, "p1"),
  fakeFetch(true, 500, "p2"),
  fakeFetch(true, 5000, "p3"),
]).then((results) => console.log(results));

recursive_promise_all([
  fakeFetch(true, 100, "p1"),
  fakeFetch(true, 500, "p2"),
  fakeFetch(true, 5000, "p3"),
]).then((results) => console.log(results));
