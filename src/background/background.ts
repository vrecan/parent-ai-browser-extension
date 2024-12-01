browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(`request: ${JSON.stringify(request)} : sender ${JSON.stringify(sender)}, sendResponse: ${JSON.stringify(sendResponse)}`);
      if (request.type === "getOpenAIKey") {
        console.log(`sending response from local storage :${localStorage.getItem("openAIKey")}`)
        sendResponse({"openApiKey": localStorage.getItem("openAIKey")});
      }
      else if(request.type === "setOpenAIKey") {
        localStorage.setItem("openApiKey", request.value);
      } else {
        console.log(`unknown request: ${request}`)
      }
        
    }
  );
