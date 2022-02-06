const fakeFetch = (paramter, delay, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      paramter ? resolve(value) : reject(`Promise rejected! ${value}`);
    }, delay);
  });
};

function Promiserace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((element) => {
      element.then((data) => resolve(data)).catch((err) => reject(err));
    });
  });
}

Promiserace([
  fakeFetch(false, 100, "p1"),
  fakeFetch(false, 500, "p2"),
  fakeFetch(false, 5000, "p3"),
])
  .then((results) => console.log(results))
  .catch((err) => {
    console.log(err);
  });
