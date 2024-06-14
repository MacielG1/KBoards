export function getTextLength(listLength = 0) {
  console.log("listLength", listLength);
  const length = listLength.toString().length;

  console.log(`${length}ch`);
  return `${length}ch`;
}
