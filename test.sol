contract Test {
  event Result(uint x);
  function double(uint x) returns (uint y){
    Result(x*2);
    return x*2;
  }
  function constantDouble(uint x) constant returns (uint y){
    return x*2;
  }
}
