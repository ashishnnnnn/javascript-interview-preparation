// Resolve if any first promise get resolved otherwise returns an aggregated error when all the error got rejected

const fakeFetch = (paramter, delay, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      paramter ? resolve(value) : reject(`Promise rejected! ${value}`);
    }, delay);
  });
};

function PromiseAny(promises) {
  return new Promise((resolve, reject) => {
    const ret_array = Array(promises.length);
    let counter = 0;
    promises.forEach((element, index) => {
      element
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          ret_array[index] = err;
          counter += 1;
          if (counter === promises.length) {
            reject(ret_array);
          }
        });
    });
  });
}

PromiseAny([
  fakeFetch(false, 100, "p1"),
  fakeFetch(false, 500, "p2"),
  fakeFetch(false, 5000, "p3"),
])
  .then((results) => console.log(results))
  .catch((err) => {
    console.log(err);
  });
