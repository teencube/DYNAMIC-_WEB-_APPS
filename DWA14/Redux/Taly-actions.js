

export  function add() {
  return{
    type: add
  }
}




export  function add() {
  return{
    type: subtract
  }
}


 function updateState(count) {
  if (count === 0) {
    return 'Normal';
  } else if (count === 10) {
    return 'Maximum Reached';
  } else if (count === -10) {
    return 'Minimum Reached';
  } else {
    return 'Normal';
  }

}