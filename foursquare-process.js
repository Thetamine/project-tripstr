function fruits(){
  let text = '';
  let fruits = "henry";

  switch(fruits) {
      case "Banana":
          text = "Banana is good!";
          break;
      case "Orange":
          text = "I am not a fan of orange.";
          break;
      case "Apple":
          text = "How you like them apples?";
          break;
      default:
          text = "I have never heard of that fruit...";
  }
  return text
}

console.log(fruits());
