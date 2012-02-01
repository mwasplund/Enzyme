/******************************************************/
/* Debug.js
/*
/* Helper class that make debugging javascript easier
/******************************************************/
var Debug = function() {};

/******************************************************/
/* Debug.Trace
/*
/* Helpful little global variable that makes printing 
/* to the console easy.
/******************************************************/
Debug.Trace = function(i_Message)
{
  try
  {
    console.log(i_Message);
  }
  catch(e)
  {
    return;
  }
}

/******************************************************/
/* Debug.Trace
/*
/* Helpful little global variable that makes printing 
/* an error to the console easy.
/******************************************************/
Debug.Error = function(i_Message)
{
  try
  {
    console.error(i_Message);
  }
  catch(e)
  {
    return;
  }
}

Debug.error = Debug.Error;
