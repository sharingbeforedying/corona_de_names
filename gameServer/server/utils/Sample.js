function sample(value) {
  if(typeof value == "string") {
    return "sample";
  } else if(typeof value == "string") {
    return 42;
  } else if(typeof value == "object") {
    return Object.create(value);
  }
}
exports.sample = sample;
