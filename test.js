let x = ["flrower", "flrow", "flright"];

var longestCommonPrefix = function (strs) {
  let prefix = "";
  for(let i = 0; i < 200; i++){
    let currS = strs[0][i];

    for(const str of strs){
      if(!str[i] || str[i] !== currS){
        return prefix;
      }
    }
    prefix += currS;
  }
};

console.log(longestCommonPrefix(x));
